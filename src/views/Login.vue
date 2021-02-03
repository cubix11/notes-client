<template>
  <section>
    <h1>Login</h1>
    <div v-if="loggingIn">
      <img src="../assets/pacman.svg">
    </div>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
    </div>
    <form v-if="!loggingIn" @submit.prevent="login()">
      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="user.username" type="text" id="username" class="form-control" aria-describedby="UsernameHelp" placeholder="Enter username">
        <label for="password">Password</label>
        <input type="password" v-model="user.password" id="password" class="form-control" aria-describedby="PasswordHelp" placeholder="Enter Password">
      </div>
      <button class="btn btn-primary btn-lg">Submit</button>
      <router-link class="m-3 btn btn-primary btn-lg" :to="{name: 'signup'}">Signup</router-link>
    </form>
  </section>
</template>
<script>
import axios from 'axios'
const LOGIN_URL = '/auth/login'
const Joi = require('joi')
const schema = Joi.object().keys({
  username: Joi.string().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30).required(),
  password: Joi.string().trim().regex(/(^[a-zA-Z0-9!@#$%^&*()_+]*$)/).min(8).required()
})
export default {
  data: () => ({
    loggingIn: false,
    errorMessage: '',
    user: {
      username: '',
      password: ''
    }
  }),
  watch: {
    user: {
      handler () {
        this.errorMessage = ''
      },
      deep: true
    }
  },
  methods: {
    login () {
      this.errorMessage = ''
      if (this.validUser()) {
        const body = {
          username: this.user.username,
          password: this.user.password
        }
        axios.post(LOGIN_URL, body, {
          headers: {
            'content-type': 'application/json'
          }
        }).then(({ data: { token } }) => {
          localStorage.token = token
          this.loggingIn = true
          setTimeout(() => {
            this.$router.push('/dashboard')
          }, 1000)
        }).catch(({ response: { data: { error } } }) => { this.errorMessage = error })
      }
    },
    validUser () {
      const result = schema.validate(this.user)
      if (result.error === undefined) {
        return true
      }
      if (result.error.message.includes('username')) {
        this.errorMessage = 'Username is invalid'
      } else {
        this.errorMessage = 'Password is invalid'
      }
    }
  }
}
</script>
