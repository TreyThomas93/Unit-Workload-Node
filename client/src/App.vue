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
  },
  methods: {
    watchStyleChange() {
      this.$store.watch(() => {
        let day = JSON.parse(this.$store.getters["GET_STYLE_CHANGE"]);

        let body = document.querySelector("body");

        if (day) {
          body.style.background = "white";
          body.style.color = "var(--primary)";
        } else {
          body.style.background = "var(--primary)";
          body.style.color = "white";
        }
      });
    }
  },
  created() {
    this.watchStyleChange();
    // screen.orientation.lock("landscape");
  }
};
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  background: #f7f7f7;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 15px;
}

::-webkit-scrollbar-track {
  background: var(--primary);
}

::-webkit-scrollbar-thumb {
  background: white;
}

#app {
  margin: 3em auto 0 auto;
  width: 100%;
  max-width: 1536px;
}

button {
  outline: none;
}

:root {
  --primary: #222d33;
  --secondary: #2D3D53;
}

.shadow {
  box-shadow: 0 0 10px rgba(1, 1, 1, 0.5);
}

/**
          TABLES
 */

.table-container {
  padding: 1em;
}

table {
  width: 100%;
  text-align: center;
  margin: 1em 0;
  font-size: 0.5rem;

  td {
    padding: 0.5em 0;
  }

  tr:nth-child(even) {
    background: rgb(26, 69, 80);
    color: white;
  }
}

.night-table {
  th,
  td {
    border-bottom: solid 1px white;
  }
}

.day-table {
  th,
  td {
    border-bottom: solid 1px var(--primary);
  }
}

@media (min-width: 1080px) {
  table {
    font-size: 0.6rem;
  }
}
</style>
