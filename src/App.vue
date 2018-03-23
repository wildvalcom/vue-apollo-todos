<template lang="pug">
    v-app
      router-view
</template>

<script>
import Todos from './components/todos.vue'

export default {
  name: 'app',
  components: {
    Todos
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.b1 {
     border: 1px dashed red;
 }
 .grow {
     flex-grow: 1;
 }
 .w100 {
     width: 100%;
 }
 .btn__content {
     text-transform: none;
 }
 .app-font {
     font-family: 'Helvetica Neue';
 }
</style>
