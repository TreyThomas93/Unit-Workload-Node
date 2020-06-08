<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
export default {
  name: "App",
  components: {
    Header,
    Footer
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  background: #f7f7f7;
}

#app {
  margin: 3em auto 0 auto;
  width: 100%;
  max-width: 1080px;
}

:root {
  --primary: #222d33;
}
</style>
