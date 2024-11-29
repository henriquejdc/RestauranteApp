import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { getOrdensProducao, putOrdemProducaoStatus } from '../../services/OrdensProducao';
import Toast from 'react-native-toast-message';

export default function OrdensProducao({ route }) {
    const { setor } = route.params;
    const [ordens, setOrdens] = useState([]);

    const fetchOrdens = async () => {
        const response = await getOrdensProducao(setor);
        if (response.status === 200) {
            const data = await response.json();
            setOrdens(data);
        } else {
            Toast.show({
                type: 'error',
                text1: 'Erro ao carregar ordens',
                text2: `Status: ${response.status}`,
            });
        }
    };

    const atualizarStatus = async (id, novoStatus) => {
        const response = await putOrdemProducaoStatus(id, novoStatus);
        if (response.status === 200) {
            Toast.show({
                type: 'success',
                text1: 'Status atualizado com sucesso!',
            });
            fetchOrdens();
        } else {
            Toast.show({
                type: 'error',
                text1: 'Erro ao atualizar status',
                text2: `Status: ${response.status}`,
            });
        }
    };

    useEffect(() => {
        fetchOrdens();
    }, []);

    const renderOrdem = ({ item }) => (
        <View style={styles.ordem}>
            <Text style={styles.text}>Item: {item.item_cardapio.nome}</Text>
            <Text style={styles.text}>Categoria: {item.item_cardapio.categoria}</Text>
            <Text style={styles.text}>Quantidade: {item.quantidade}</Text>
            <Text style={styles.text}>Setor: {item.setor}</Text>
            <Text style={styles.text}>Status: {item.status}</Text>
            <Text style={styles.text}>Mesa: {item.comanda.mesa_id}</Text>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.button_producao}
                    onPress={() => atualizarStatus(item.id, 'em_producao')}
                >
                    <Text style={styles.buttonText}>Em Produção</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button_pronto}
                    onPress={() => atualizarStatus(item.id, 'pronto')}
                >
                    <Text style={styles.buttonText}>Pronto</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button_entregue}
                    onPress={() => atualizarStatus(item.id, 'entregue')}
                >
                    <Text style={styles.buttonText}>Entregar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ordens de Produção</Text>
            <FlatList
                data={ordens}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderOrdem}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma ordem encontrada</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
    ordem: {
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    text: { fontSize: 16, marginBottom: 5 },
    actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    button_entregue: {
        backgroundColor: '#00693E',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    button_pronto: {
        backgroundColor: '#33b8ff',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    button_producao: {
        backgroundColor: '#b3bb31',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#888' },
});
