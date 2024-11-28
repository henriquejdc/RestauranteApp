import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../constants"

export const putComandaAdicionaItem = async (id, item_cardapio_id, quantidade) => {
    return fetch(`${API_URL}/comandas/${id}/adicionar-item`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        },
        body: JSON.stringify({
            'item_cardapio_id': item_cardapio_id,
            'quantidade': quantidade,
        })
    })
}

export const putComandaFechar = async (id) => {
    return fetch(`${API_URL}/comandas/${id}/fechar`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        }
    })
}

export const postComanda = async (mesa_id, usuario_id) => {
    return fetch(`${API_URL}/comandas`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        },
        body: JSON.stringify({
            'usuario_id': usuario_id,
            'mesa_id': mesa_id,
        })
    })
}

export const getComandas = async () => {
    return fetch(
        `${API_URL}/comandas`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        }}
    )
}

export const getComanda = async (id) => {
    return fetch(
        `${API_URL}/comandas/${id}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        }}
    )
}
