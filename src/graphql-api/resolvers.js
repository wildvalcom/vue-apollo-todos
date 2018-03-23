const shortid = require('shortid')

module.exports = {
  Query: {
    todos: (root, args, { db }) => {
      let { filter = 'ALL', orderBy } = args
      let todos = db.get('todos')
      let filterBy = {}

      switch (filter) {
        case 'ACTIVE':
            filterBy.completed = false
          break;
        case 'COMPLETED':
            filterBy.completed = true
          break;
      }

      if (orderBy) {
        todos = todos.orderBy(item => item.title.toLowerCase(), orderBy.toLowerCase())
      }

      todos = todos.filter(filterBy)

      return todos.value()
    },
  },

  Mutation: {
    addTodo: (root, { input }, { pubsub, db }) => {
      const todo = {
        id: shortid.generate(),
        title: input.title,
        completed: false,
      }

      db
        .get('todos')
        .push(todo)
        .last()
        .write()

      pubsub.publish('todos', { todoAdded: todo })

      return {
        todo,
      }
    },

    updateTodo: (root, { input }, { pubsub, db }) => {
      const { id, title, completed = false } = input
      const todos = db.get('todos')

      todos
        .find({ id })
        .assign({ title, completed })
        .write()

      const todo = todos
        .find({ id })
        .value()

      return {
        todo,
      }
    },

    deleteTodo: (root, { input }, { pubsub, db }) => {
      const id = input.id;
      const todos = db.get('todos')

      const todo = todos
        .find({ id })
        .value()

      if (!todo) return {
        success: false
      }

      todos
        .remove({ id })
        .write()

      return {
        success: true
      };
    },
  },

  Subscription: {
    todoAdded: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('todos'),
    },
  },
}
