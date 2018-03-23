<template lang="pug">
    div
        template(v-for="(todo, index) in todos")

            v-divider(v-if="index>0")

            .todo-row.px-3.py-1
                v-layout(align-center)
                    v-checkbox.shrink(
                      input-value="!todo.completed",
                      :value="!todo.completed"
                      hide-details,
                      @change="$emit('update-todo', {todo, updatedTodo: {completed: $event}})"
                    )
                    v-text-field(:value="todo.title", solo, flat, @input="$emit('update-todo', {todo, updatedTodo: {title: $event}})")
                    v-btn.mr-0(flat, icon, @click="$emit('remove-todo', todo.id)")
                        v-icon.delete-todo(color="red") delete
</template>

<script>
    export default {
        props: {
            todos: Array,
        },
    }
</script>


<style lang="scss" scoped>
    .delete-todo {
        opacity: 0;
        .todo-row:hover & {
            opacity: 1;
        }
    }
</style>
