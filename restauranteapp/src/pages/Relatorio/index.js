import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { getRelatorioVendas } from '../../services/Relatorios';
import Toast from 'react-native-toast-message';

export default function Relatorio({ navigation }) {
    const [relatorio, setRelatorio] = useState({});
    const [detalhes, setDetalhes] = useState([]);

    const fetchRelatorio = async () => {
        const response = await getRelatorioVendas();
        if (response.status === 200) {
            const data = await response.json();
            setRelatorio(data);
            setDetalhes(data.detalhes);
        } else {
            Toast.show({
                type: 'error',
                text1: 'Erro ao carregar relatório',
                text2: `Status: ${response.status}`,
            });
        }
    };

    const verDetalhesComanda = (comanda_id) => {
        navigation.navigate('Fechar Comanda', { comanda_id });
    };

    useEffect(() => {
        fetchRelatorio();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.text}>Comanda ID: {item.comanda_id}</Text>
            <Text style={styles.text}>Total: R$ {item.total.toFixed(2)}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => verDetalhesComanda(item.comanda_id)}
            >
                <Text style={styles.buttonText}>Ver Detalhes</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Relatório de Vendas</Text>
            <Text style={styles.totalText}>Total de Vendas: R$ {relatorio.totalVendas?.toFixed(2)}</Text>
            <FlatList
                data={detalhes}
                keyExtractor={(item) => String(item.comanda_id)}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma venda registrada</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    totalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    item: {
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    text: { fontSize: 16, marginBottom: 5 },
    button: {
        backgroundColor: '#00693E',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#888' },
});
