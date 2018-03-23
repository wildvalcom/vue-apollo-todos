<template lang="pug">
  div
    app-title

    v-container(style="max-width: 800px;")
      v-card.app-font
        todos-new.py-2(
          v-model="newTodo",
          @add-todo="addTodo($event); newTodo = '';",
          @complete-all="completeAll"
        )

        v-divider
        v-divider

        div(v-if="todos && todos.length")
          todos-list(
            :todos="todos",
            @remove-todo="removeTodo"
            @update-todo="updateTodo"
          )

        v-divider

        todos-footer.py-2(
          :remaining-items="remainingItems"
          @clear-completed="clearCompleted"
        )

      hr.mx-1
      hr.mx-2
      hr.mx-3
</template>


<script>
import AppTitle from './app-title'
import TodosList from './todos-list'
import TodosNew from './todos-new'
import TodosFooter from './todos-footer'

import _ from 'lodash';
import TODOS_ALL from '../graphql/Todos.gql'
import ADD_TODO_MUTATION from '../graphql/AddTodo.gql'
import UPDATE_TODO_MUTATION from '../graphql/UpdateTodo.gql'
import DELETE_TODO_MUTATION from '../graphql/DeleteTodo.gql'

import TODO_ADDED from '../graphql/TodoAdded.gql'

export default {
  components: {
    AppTitle,
    TodosList,
    TodosNew,
    TodosFooter,
  },
  props: {
    visibility: { type: String, default: 'all' },
  },
  data () {
    return {
      newTodo: '',
      todos: null,
      orderBy: null
    }
  },

  apollo: {
    todos: {
      query: TODOS_ALL,
      variables() {
        return {
          filter: this.visibility.toUpperCase(),
        }
      },
      loadingKey: 'loading',
      result ({ data, loading }) {
        if (!loading) {
          this.todos = [].concat(data.todos);
        }
      },
      fetchPolicy: 'cache-and-network',
      subscribeToMore: {
        document: TODO_ADDED,
        skip() {
          return this.visibility === 'completed'
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            todos: [
              ...previousResult.todos,
              subscriptionData.data.todoAdded,
            ],
          }
        },
      },
    }
  },

  computed: {
    formValid () {
      return this.newTodo
    },
    remainingItems () {
      return (this.todos && this.todos.length > 0) ? this.todos.filter(item => !item.completed).length : -1
    },
  },

  methods: {
    addTodo () {
      if (this.formValid) {
        this.$apollo.mutate({
          mutation: ADD_TODO_MUTATION,
          variables: {
            input: {
              title: this.newTodo,
            },
          },
        })

        this.newTodo = ''
      }
    },

    updateTodo: _.debounce(function (data) {
      const todo = { ...data.todo, ...data.updatedTodo }
      this.$apollo.mutate({
        mutation: UPDATE_TODO_MUTATION,
        variables: {
          input: {
            id: todo.id,
            title: todo.title,
            completed: todo.completed,
          },
        },
        update: (store) => {
          const queries = [
            {
              query: TODOS_ALL,
              variables: {
                filter: this.visibility.toUpperCase(),
              },
            },
          ]

          const data = queries.map(query => store.readQuery(query))
          data.forEach(({ todos: list }) => {
            const index = list.findIndex(o => o.id === todo.id)
            if (index !== -1) {
              if (
                todo.completed && this.visibility.toUpperCase() === 'ACTIVE' ||
                !todo.completed && this.visibility.toUpperCase() === 'COMPLETED'
              ) {
                list.splice(index, 1)
              } else {
                list[index] = todo
              }
            }
          })
          queries.forEach((query, index) => {
            store.writeQuery({
              ...query,
              data: data[index],
            })
          })
        },
      })
    }, 500),

    removeTodo (id) {
      this.$apollo.mutate({
        mutation: DELETE_TODO_MUTATION,
        variables: {
          input: {
            id,
          },
        },
        update: (store) => {
          const queries = [
            {
              query: TODOS_ALL,
              variables: {
                filter: this.visibility.toUpperCase(),
              },
            },
          ]
          const data = queries.map(query => store.readQuery(query))
          data.forEach(({ todos: list }) => {
            const index = list.findIndex(o => o.id === id)
            if (index !== -1) {
              list.splice(index, 1)
            }
          })
          queries.forEach((query, index) => {
            store.writeQuery({
              ...query,
              data: data[index],
            })
          })
        },
      })
    },

    completeAll() {
      console.log('completeAll')
    },

    clearCompleted() {
      console.log('clearCompleted')
    },
  },
}
</script>
