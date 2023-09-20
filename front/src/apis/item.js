import Item from '@/classes/Item'

const BASE_API = import.meta.env.VITE_BASE_API
const ERROR_MESSAGE = 'Erreur dans item.js'

export async function getItems(userID, type) {
  try {
    const response = await fetch(BASE_API + `/items/${type}/user/${userID}`, {
      method: 'GET'
    })
    const data = await response.json()
    return data.map((i) => new Item(i))
  } catch (error) {
    console.error(ERROR_MESSAGE, error)
    throw error
  }
}

export async function deleteItem(itemID) {
  try {
    const response = await fetch(BASE_API + `/items/${itemID}`, {
      method: 'DELETE'
    })

    if (!response.ok) return false

    const data = await response.json()
    return data?.affectedRows !== 0
  } catch (error) {
    console.error(ERROR_MESSAGE, error)
    throw error
  }
}

export function insertItem(item) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(BASE_API + `/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      })

      const data = await response.json()
      resolve(data)
    } catch (error) {
      console.error(ERROR_MESSAGE, error)
      reject(error)
    }
  })
}

export function updateItem(item) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(BASE_API + `/items/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      })

      const data = await response.json()
      resolve(data)
    } catch (error) {
      console.error(ERROR_MESSAGE, error)
      reject(error)
    }
  })
}

export function reserveItem(itemId, user, email, itemTitle) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(BASE_API + `/items/${itemId}/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          user,
          itemTitle
        })
      })

      const data = await response.json()
      resolve(data)
    } catch (error) {
      console.error(ERROR_MESSAGE, error)
      reject(error)
    }
  })
}

export function deleteReservation(uuid) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(BASE_API + `/reservation/${uuid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      resolve(data)
    } catch (error) {
      console.error(ERROR_MESSAGE, error)
      reject(error)
    }
  })
}
