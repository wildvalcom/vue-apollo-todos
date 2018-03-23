module.exports = `
type Todo {
  id: ID!
  title: String!
  completed: Boolean!
}

enum TodoFilter {
  ALL
  ACTIVE
  COMPLETED
}

enum TodoOrderBy {
  ASC
  DESC
}

input addTodoInput {
  title: String!
}

type addTodoPayload {
  todo: Todo
}

input updateTodoInput {
  id: ID!
  title: String!
  completed: Boolean!
}

type updateTodoPayload {
  todo: Todo
}

input deleteTodoInput {
  id: ID!
}

type deleteTodoPayload {
  success: Boolean!
}


type Query {
  todos(filter: TodoFilter, orderBy: TodoOrderBy): [Todo]
}

type Mutation {
  # Add a todo and publish it on 'todos' subscription channel
  addTodo(input: addTodoInput!): addTodoPayload!

  updateTodo(input: updateTodoInput!): updateTodoPayload!
  deleteTodo(input: deleteTodoInput!): deleteTodoPayload!
}

type Subscription {
  # When a new todo is added
  todoAdded: Todo!
}
`
