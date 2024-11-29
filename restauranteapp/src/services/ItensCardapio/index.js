import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../constants"

export const deleteItemCardapio = async (id) => {
    return fetch(`${API_URL}/itens-cardapio/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        }
    })
}

export const postItemCardapio = async (novoItem) => {
    return fetch(`${API_URL}/itens-cardapio`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        },
        body: JSON.stringify(novoItem)
    })
}

export const getItensCardapio = async (categoria) => {
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
