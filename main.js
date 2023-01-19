import './style.css'
import { supabase } from './supabase.js'

// Auth

// Listen to auth events
supabase.auth.onAuthStateChange((event, session) => {
  if (event == 'SIGNED_IN') {
    console.log('SIGNED_IN', session)

    // Hide login
    document.querySelector("#login").classList.add("hidden")

    // Show logout
    document.querySelector("#logout > h2").innerText = session.user.email
    document.querySelector("#logout").classList.remove("hidden")

    // Show new tweet
    document.querySelector("main > div").classList.remove("hidden")
  }

  if (event == 'SIGNED_OUT') {
    // Show login
    document.querySelector("#login").classList.remove("hidden")

    // Hide logout
    document.querySelector("#logout").classList.add("hidden")

    // Hide new tweet
    document.querySelector("main > div").classList.add("hidden")
  }
})


// Sign in/up
const form = document.querySelector("form")

form.addEventListener("submit", async function (event) {
  const email = form[0].value
  const password = form[1].value

  event.preventDefault()

  // Login
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // If login error
  if (signInError) {
    // If no account, sign up  
    if (signInError.message === "Invalid login credentials") {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpData.user.id) {
        const { error } = await supabase
        .from('users')
        .insert({ username: signUpData.user.email })
      }

      // If user already registered
      if (signUpError.message === "User already registered") {
        alert(signInError.message)
      } else {
        alert(signUpError.message)
      }
    }
  }
})

// Sign out
const signOutButton = document.querySelector("#logout > button")

signOutButton.addEventListener("click", async function () {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.log(error)
  }
})

// Tweets

// Listen for changes to database table
supabase
  .channel('public:tweets')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tweets' }, newTweet)
  .subscribe()

function newTweet (e) {
  console.log(e)
}

async function getTweets() {
  // Get data from database
  const { data, error } = await supabase
    .from('tweets')
    .select(`
      id,
      message,
      created_at,
      users (
        username
      )
    `).order('created_at', {ascending: false})

  if (error) {
    console.log(error)
  }

  const listEl = document.querySelector('ul')

  // Loop over tweets
  for (const i of data) {
    const itemEl = document.createElement('li')
    itemEl.classList.add('flex', 'gap-4', 'border-b', 'pb-6')

    itemEl.innerHTML = `
      <div class="w-14 h-14 rounded-full">
        <img
          src="logo.png"
          alt=""
        >
      </div>
      <div>
        <div class="flex gap-2 text-gray-500">
          <span class="font-semibold text-black">${i.users.username}</span>
          <span>${new Date(i.created_at).toLocaleString()}</span>
        </div>
        <p>${i.message}</p>
        <button class="flex items-center gap-2 mt-1  hover:text-red-300">
          <i class="ph-heart text-xl"></i>
          <span class="text-sm">0</span>
        </button>
      </div>
    `

    listEl.appendChild(itemEl)
  }
}

getTweets()


// New tweet
document.querySelector("#tweet").addEventListener("click", async function() {
  const text = document.querySelector("textarea")

  const { data, error } = await supabase.auth.getSession()

  if (error) console.log(error)

  if (data.session.user.id) {
    const { error } = await supabase
      .from('tweets')
      .insert({ message: text.value })

      if (error) console.log(error)

      // Clear input
      text.value = ''
  }
})
