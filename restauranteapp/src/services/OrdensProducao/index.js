import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../constants"

export const putOrdemProducaoStatus = async (id, status) => {
    return fetch(`${API_URL}/ordens/${id}/status`, {
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

export const getOrdensProducao = async (setor) => {
    return fetch(
        `${API_URL}/ordens/${setor}`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        }}
    )
}
