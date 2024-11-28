import { API_URL } from "../constants"

export const postLogin = async (email, password) => {
    return fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'email': email,
            'senha': password
        })
    })
}

export const postRegister = async (name, email, password) => {
    return fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'nome': name,
            'email': email,
            'senha': password
        })
    })
}