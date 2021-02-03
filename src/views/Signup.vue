<template>
    <section>
      <h1>Signup</h1>
      <div v-if="signingUp">
        <img src="../assets/pacman.svg">
      </div>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <form v-if="!signingUp" @submit.prevent="signup()">
        <div class="form-group">
          <label for="username">Username</label>
          <input v-model="user.username" type="text" required class="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter username">
          <p id="usernameHelp" class="form-text text-muted">Username must be longer than 2 characters, shorter than 30. Username can only contain alphanumeric characters.</p>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="password">Password</label>
            <input v-model="user.password" type="password" required class="form-control" id="password" aria-describedby="passwordHelp" placeholder="Password">
            <p class="form-text text-muted">Password must be 8 or more characters long.</p>
          </div>
          <div class="form-group col-md-6">
            <label for="confirmPassword">Confirm Password</label>
            <input v-model="user.confirmPassword" type="password" required class="form-control" id="confirmPassword" aria-describedby="confirmPasswordHelp" placeholder="Confirm Password">
            <p class="form-text text-muted">Please confirm your password.</p>
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-lg">Submit</button>
        <router-link class="ml-3 btn btn-primary btn-lg" :to="{name: 'login'}">Login</router-link>
      </form>
  </section>
</template>

<script>
import axios from 'axios'
const SIGNUP_URL = '/auth/signup'
const Joi = require('joi')
const schema = Joi.object().keys({
  username: Joi.string().regex(/(^[a-zA-Z0-9_]*$)/).min(2).max(30).required(),
  password: Joi.string().trim().regex(/(^[a-zA-Z0-9!@#$%^&*()_+]*$)/).min(8).required(),
  confirmPassword: Joi.string().trim().regex(/(^[a-zA-Z0-9!@#$%^&*()_+]*$)/).min(8).required()
})
export default {
  data: () => ({
    signingUp: false,
    errorMessage: '',
    user: {
      username: '',
      password: '',
      confirmPassword: ''
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
    signup () {
      this.errorMessage = ''
      if (this.validUser()) {
        const body = {
          username: this.user.username,
          email: this.user.email,
          password: this.user.password
        }
        axios.post(SIGNUP_URL, body, {
          headers: {
            'content-type': 'application/json'
          }
        }).then(response => {
          if (response.statusText === 'OK') {
            return response.data
          } else {
            throw new Error(response.data.error)
          }
        }).then(user => {
          localStorage.token = user.token
          this.signingUp = true
          setTimeout(() => {
            this.signingUp = false
            this.$router.push('/dashboard')
          }, 1000)
        }).catch(error => {
          if (error.message.includes('Request failed with status code 409')) {
            this.errorMessage = 'Duplicate username'
          }
        })
      }
    },
    validUser () {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = 'Passwords must match'
        return false
      }
      const result = schema.validate(this.user)
      if (result.error === undefined) {
        return true
      }
      if (result.error.message.includes('username')) {
        this.errorMessage = 'Username is invalid'
      } else if (result.error.message.includes('password')) {
        this.errorMessage = 'Password is invalid'
      } else {
        this.errorMessage = 'Email is invalid'
      }
      return false
    }
  }
}
</script>
