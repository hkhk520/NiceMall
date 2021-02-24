<template>
  <div id="app">
    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__fadeIn"
    >
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
.auto-img {
  width: 100%;
  height: auto;
  display: block;
}
li {
  list-style: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  background-color: #eee;

  // #ff5777
}

:root {
  --animate-duration: 500ms;
}
</style>
