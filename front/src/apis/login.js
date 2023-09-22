const BASE_API = import.meta.env.VITE_BASE_API
const ERROR_MESSAGE = 'Erreur dans login.js'

export async function getLogin(email, password) {
    try {
        const response = await fetch(BASE_API + `/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        })
        return await response.json()

    } catch (error) {
        console.error(ERROR_MESSAGE, error)
        throw error
    }
}

export async function checkToken(token) {
    try {
        const response = await fetch(BASE_API + `/token/${token}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Réponse HTTP non valide');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
