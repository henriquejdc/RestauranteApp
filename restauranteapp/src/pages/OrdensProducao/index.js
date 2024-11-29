import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { getOrdensProducao, putOrdemProducaoStatus } from '../../services/OrdensProducao';
import Toast from 'react-native-toast-message';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/BackButton';

export default function OrdensProducao({ route }) {
    const { setor } = route.params;
    const [ordens, setOrdens] = useState([]);
    const [nameUser, setName] = React.useState('')
    const navigation = useNavigation()

    const getNameUser = async () => {
        const name = await AsyncStorage.getItem('name')
        setName(name);
        const token = await AsyncStorage.getItem('token');
        if (token === null) {
            navigation.navigate('Home')
        }
    }

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
        getNameUser();
    }, []);

    const renderOrdem = ({ item }) => (
        <View style={styles.ordem}>
            <Text style={styles.text}><b>Item: </b>{item.item_cardapio.nome}</Text>
            <Text style={styles.text}><b>Categoria: </b>{item.item_cardapio.categoria}</Text>
            <Text style={styles.text}><b>Quantidade: </b>{item.quantidade}</Text>
            <Text style={styles.text}><b>Setor: </b>{item.setor}</Text>
            <Text style={styles.text}><b>Status: </b>{item.status}</Text>
            <Text style={styles.text}><b>Mesa: </b>{item.comanda.mesa_id}</Text>

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
        <SafeAreaView style={styles.container}>
            <BackButton />
            <View style={styles.contentHeader}>
                <Header name={nameUser} />
            </View>

            <View style={styles.content}>
                <Text style={styles.titlePage}>Ordens de Produção</Text>
                <FlatList
                    data={ordens}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderOrdem}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma ordem encontrada</Text>}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00693E'
    },
    titlePage: {
        fontSize: 26,
        fontWeight: 'bold',
        margin: 14,
        color: '#00693E',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
    },
    contentHeader: {
        flex: 1,
        backgroundColor: "#00693E",
        alignItems: 'center',
        justifyContent: 'center'
    },
    content: {
        flex: 5,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingRight: '5%',
    },
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
