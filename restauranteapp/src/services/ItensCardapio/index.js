import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../constants"

export const deleteItensCardipio = async (id) => {
    return fetch(`${API_URL}/itens-cardapio/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        }
    })
}

export const postItensCardipio = async (nome, categoria, preco) => {
    return fetch(`${API_URL}/itens-cardapio`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        },
        body: JSON.stringify({
            'nome': nome,
            'categoria': categoria,
            'preco': preco,
        })
    })
}

export const getItensCardipio = async (categoria) => {
    const url = `${API_URL}/itens-cardapio${categoria ? `?categoria=${categoria}` : ''}`

    return fetch(
        url,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        }}
    )
}
