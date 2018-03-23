const shortid = require('shortid')

module.exports = {
  Counter: {
    countStr: counter => `Current count: ${counter.count}`,
  },

  Query: {
    todos: (root, args, { db }) => {
      console.log(args);
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
    counter: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).substring(2, 15) // random channel name
        let count = 0
        setInterval(() => pubsub.publish(
          channel,
          {
            // eslint-disable-next-line no-plusplus
            counter: { count: count++ },
          }
        ), 2000)
        return pubsub.asyncIterator(channel)
      },
    },

    todoAdded: {
      subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('todos'),
    },
  },
}
