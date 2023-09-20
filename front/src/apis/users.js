import User from '@/classes/User.js'

const BASE_API = import.meta.env.VITE_BASE_API
const ERROR_MESSAGE = 'Erreur lors de la récupération de la liste des utilisateurs'

export async function getUsers() {
  try {
    const response = await fetch(BASE_API + '/users')
    const data = await response.json()
    const sortedUsers = data.sort((a, b) => a.name.localeCompare(b.name))
    return sortedUsers.map((user) => new User(user))
  } catch (error) {
    console.error(ERROR_MESSAGE, error)
    throw error
  }
}

export async function getUser(id) {
  try {
    const response = await fetch(BASE_API + '/users/' + id)
    const data = await response.json()
    return new User(data[0])
  } catch (error) {
    console.error(ERROR_MESSAGE, error)
    throw error
  }
}

export function insertUser(user) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(BASE_API + `/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })

      const data = await response.json()
      resolve(true)
    } catch (error) {
      console.error(ERROR_MESSAGE, error)
      reject(error)
    }
  })
}

export function updateUser(userID, description, birthdayDate) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(BASE_API + `/user/${userID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description, birthdayDate })
      })
      const data = await response.json()
      resolve(data)
    } catch (error) {
      console.error(ERROR_MESSAGE, error)
      reject(error)
    }
  })
}
