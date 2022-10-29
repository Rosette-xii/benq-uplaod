<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
@import './assets/style/SCSS/_mixin.scss';
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 20px;
  @include pad {
    font-size: 16px;
  }
}
#app {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $sub-color;
}
h1 {
  padding: 32px 0;
  font-size: 2.5rem;
  font-family: multi-display, sans-serif;
  font-weight: 700;
  font-style: italic;
  text-align: center;
}
img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
ul {
  list-style-type: none;
}
a {
  color: $main-color;
}
.btn {
  display: inline-block;
  padding: 20px 80px;
  border: none;
  background-color: $main-color;
  color: #fff;
  border-radius: 80px;
  font-weight: bold;
  cursor: pointer;
  @include pad {
    padding: 20px 60px;
  }
  @include mobile {
    padding: 20px 40px;
  }
}
.container {
  margin: 0 auto;
  padding: 0 2rem;
  max-width: 990px;
  @include pad {
    max-width: 990px;
  }
}
</style>
