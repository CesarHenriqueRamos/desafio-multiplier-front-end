<template>
  <div id="app">
    <Header @search="searchClick($event)" />
      <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Home from './pages/Home.vue';
import Footer from './components/Footer.vue'


export default {
  name: 'App',
  components: {
    Header,
    Home,
    Footer
  },
  data() {
    return {
      info:""
    }
  },
  methods: {
    searchClick(e){
      console.log(e)
      this.info = e;
    }
  },
  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
