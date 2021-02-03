<template>
  <div class="home">
    <div class="jumbotron text-center">
      <h1 class="display-3">Notes Website</h1>
      <p class="lead">Taking notes is helpful, so I made this website</p>
      <hr class="my-4">
      <p class="lead">
        <router-link
        class="btn btn-primary btn-lg mr-3"
        :to="{name: 'signup'}"
        role="button">Sign up</router-link>
        <router-link
        class="btn btn-primary btn-lg"
        :to="{name: 'login'}"
        role="button"
        >Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home'
}
</script>
