<template>
  <div class="app-container">
    <!-- adding my navbar information for portfolio, github etc -->

    <div class="navbar">
      <md-toolbar md-elevation="1">
        <a class="md-title" style="flex: 1" href="https://github.com/mMmenges/mytodo/">
        
        </a>
        <a
          href="https://github.com/mMmenges/mytodo/"
          role="menuitem"
          class="navigation-list_item"
        >Refresh</a>
        <a
          href="https://mmmenges.github.io/portfolio-website/"
          target="_blank"
          role="menuitem"
          class="navigation-list_item"
        >Portfolio
        </a>
        <a
          href="https://mmenges.com"
          target="_blank"
          role="menuitem"
          class="navigation-list_item"
        >Github</a>
      </md-toolbar>
    </div>

    <!-- List input and initial view -->

    <div class="todo-container">
      <md-field class="todo-input">
        <md-input
          v-model="currentTodo"
          @keydown.enter="addTodo()"
          placeholder="add new list item"
          class="todo-input-area"
        ></md-input>
        <md-button class="md-fab md-mini" v-model="currentTodo" v-on:click="addTodo">
          <md-icon>add</md-icon>
        </md-button>
      </md-field>

      <!-- then the todo list actually displayed -->

      <md-card class="card-list" v-if="displayList()">
        <md-card-content>
          <md-list class="todos">
            <md-subheader>Things that I plan to do:</md-subheader>

            <md-list-item v-for="todo in todos" :key="todo.id">
              <input type="checkbox" v-model="todo.completed" class="checkbox" />
              <span
                class="input-list-item"
                v-on:dblclick="editTodo(todo)"
                v-show="editTodoId !== todo.id"
                :class="{ completed: todo.completed }"
              >{{ todo.label }}</span>
              <input
                v-model="todo.label"
                v-show="editTodoId == todo.id"
                v-on:keydown.enter="saveTodo"
                class="input-edit-item"
              />
              <md-button
                class="md-fab md-mini"
                v-show="editTodoId !== todo.id"
                @click="editTodo(todo)"
              >
                <md-icon>edit</md-icon>
              </md-button>
              <md-button
                class="md-fab md-mini"
                size="small"
                v-show="editTodoId == todo.id"
                @click="saveTodo"
              >
                <md-icon>save</md-icon>
              </md-button>
              <md-button class="md-fab md-mini" @click="removeTodo(todo)">
                <md-icon>cancel</md-icon>
              </md-button>
            </md-list-item>
          </md-list>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      todos: [],
      currentTodo: "",
      editTodoId: null,
    };
  },
  methods: {
    displayList() {
      return this.todos.length > 0;
    },
    addTodo() {
      this.todos.push({
        id: this.todos.length,
        label: this.currentTodo,
        completed: false,
      });
      this.currentTodo = "";
    },
    removeTodo(todo) {
      var index = this.todos.indexOf(todo);
      this.todos.splice(index, 1);
    },
    editTodo(todo) {
      this.editTodoId = todo.id;
    },
    saveTodo() {
      this.editTodoId = null;
    },
  },
};
</script>

<style>
body {
  background: #b2b2b291;
  color: #042a54;
}
.navbar {
  background: #b2b2b2;
}
.navbar-img {
  max-width: 180px;
}
.navbar-img:hover,
.navbar-img:focus {
  opacity: 0.8;
}
a {
  color: #042a54;
  cursor: pointer;
  margin-right: 2em;
  padding-right: 2em;
}
.container {
  position: center;
}
.todo-input {
  max-width: 40em;
  padding-bottom: 0.8em;
  border-bottom: 1px solid rgba(4, 42, 84, 0.3);
}
.todo-input-area {
  margin-left: 6em;
}
.checkbox {
  width: 20px;
  height: 20px;
}
.card-list {
  margin: 0 auto;
  background: #3771ac;
  border-radius: 10px;
  max-width: 60em;
}
.input-list-item {
  width: 75%;
}
.input-edit-item {
  width: 75%;
  background: #e5e9ed;
  border: none;
  font-size: 1em;
  color: #042a54;
}
@media all and (max-width: 750px) {
  .navbar-img {
    max-width: 80px;
  }
}
</style>