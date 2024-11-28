import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../constants"

export const putMesaStatus = async (id, status) => {
    return fetch(`${API_URL}/mesas/${id}/status`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        },
        body: JSON.stringify({
            'status': status
        })
    })
}

export const deleteMesa = async (id) => {
    return fetch(`${API_URL}/mesas/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        }
    })
}

export const postMesa = async (numero,  status) => {
    return fetch(`${API_URL}/mesas`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        },
        body: JSON.stringify({
            'numero': numero,
            'status': status,
        })
    })
}

export const getMesas = async () => {
    return fetch(
        `${API_URL}/mesas`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        }}
    )
}
