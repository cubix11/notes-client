<template>
  <section>
    <h1>Dashboard</h1>
    <h1 v-if="!user">Getting User...</h1>
    <h1 v-if="user">Hello, {{user.username}}!!</h1>
    <div v-if="message" class="alert alert-danger" role="alert">
      {{ message }}
    </div>
    <button @click="logout()" class="btn btn-primary">Logout</button><button @click="deleteAccount()" class="btn btn-primary ml-2">Delete Account</button>
    <button @click="showForm = !showForm" class="btn ml-2 btn-info">Toggle Form</button>
    <form @submit.prevent="addNote()" v-if="showForm">
      <div class="form-group">
        <label for="title">Title</label>
        <input required v-model="newNote.title" type="text" class="form-control" id="title" aria-describedby="titleHelp" placeholder="Enter a title">
        <small id="titleHelp" class="form-text text-muted">Enter a descriptive title for your note.</small>
      </div>
      <div class="form-group">
        <label for="note">Note</label>
        <textarea v-model="newNote.note" id="note" required class="form-control" placeholder="Enter your note" rows="3"></textarea>
      </div>
      <button class="btn btn-primary">Add Note</button>
    </form>
    <section class="row mt-3">
      <div class="col-4" :key="note._id" v-for="note in notes">
        <div class="card border-info mb-3">
          <div class="card-header">{{note.title}}<span @click="removeItem(note._id)">×</span></div>
          <div class="card-body">
            <p class="card-text" v-html="renderMarkdown(note.note)"></p>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>
<script>
import Markdownit from 'markdown-it'
import MDemoji from 'markdown-it-emoji'
import axios from 'axios'
const md = new Markdownit()
md.use(MDemoji)
const API_URL = '/'
export default {
  data: () => ({
    message: '',
    showForm: false,
    user: null,
    newNote: {
      title: '',
      note: ''
    },
    notes: []
  }),
  mounted () {
    axios.get(`${API_URL}checkUser`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }
    }).then(response => response.data).then(res => {
      if (res.user) {
        this.user = res.user
        this.getNotes()
        if (localStorage.note) {
          const noteData = JSON.parse(localStorage.note)
          this.newNote.title = noteData.title
          this.newNote.note = noteData.note
          localStorage.removeItem('note')
          this.addNote()
        }
        if (localStorage.noteId) {
          this.removeItem(localStorage.noteId)
        }
        if (localStorage.deleteUser) {
          this.deleteAccount()
        }
      } else {
        this.logout()
      }
    })
  },
  methods: {
    deleteAccount () {
      const deleteAccount = confirm('Are you sure that you want delete your account?')
      if (!deleteAccount) return
      localStorage.deleteUser = true
      axios.delete(`${API_URL}auth/deleteAccount`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      }).then(res => res.data).then(data => {
        localStorage.removeItem('deleteUser')
        localStorage.removeItem('token')
        this.$router.push('/signup')
      }).catch(() => {
        this.logout()
      })
    },
    renderMarkdown (note) {
      return md.render(note)
    },
    getNotes () {
      axios.get(`${API_URL}api/notes`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      }).then(response => response.data).then(notes => { this.notes = notes })
    },
    logout () {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    addNote () {
      localStorage.note = JSON.stringify(this.newNote)
      axios.post(`${API_URL}api/notes`, this.newNote,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`
          }
        }).then(response => response.data).then(note => {
        localStorage.removeItem('note')
        this.newNote = {
          title: '',
          note: ''
        }
        this.notes.push(note)
        this.message = 'Added!'
        setTimeout(() => { this.message = '' }, 1000)
      }).catch(({ response: { data: { error } } }) => {
        if (error === 'Unauthorized') {
          this.logout()
        }
      })
    },
    removeItem (id) {
      localStorage.noteId = id
      const index = this.notes.findIndex(note => note._id === id)
      axios.delete(`${API_URL}api/notes`,
        {
          data: {
            id: id
          },
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${localStorage.token}`
          }
        }).then(response => response.data).then(data => {
        localStorage.removeItem('noteId')
        this.notes.splice(index, 1)
        this.message = 'Deleted!'
        setTimeout(() => { this.message = '' }, 1000)
      }).catch(({ response: { data: { error } } }) => {
        if (error === 'Unauthorized') {
          this.logout()
        }
      })
    }
  }
}
</script>
<style>
  .card {
    height: 90%;
  }
  .card-text img {
    width: 100%
  }
  .card span {
    float: right;
    padding: 5px 10px 5px 10px;
    border-radius: 10px;
  }
  .card span:hover {
    cursor: pointer;
    background-color: red;
  }
</style>
