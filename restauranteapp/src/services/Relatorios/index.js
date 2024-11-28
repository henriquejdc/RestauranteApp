import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants';

export const getRelatorioVendas = async () => {
    return fetch(
        `${API_URL}/relatorio-vendas/`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await AsyncStorage.getItem('token'),
        }}
    )
}