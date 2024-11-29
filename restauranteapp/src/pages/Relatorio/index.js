import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { getRelatorioVendas } from '../../services/Relatorios';
import Toast from 'react-native-toast-message';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../../components/BackButton';

export default function Relatorio({ navigation }) {
    const [relatorio, setRelatorio] = useState({});
    const [detalhes, setDetalhes] = useState([]);
    const [nameUser, setName] = React.useState('')

    const getNameUser = async () => {
        const name = await AsyncStorage.getItem('name')
        setName(name);
        const token = await AsyncStorage.getItem('token');
        if (token === null) {
            navigation.navigate('Home')
        }
    }

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
        getNameUser();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.text}><b>Comanda ID: </b>{item.comanda_id}</Text>
            <Text style={styles.text}><b>Total: </b>R$ {item.total.toFixed(2)}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => verDetalhesComanda(item.comanda_id)}
            >
                <Text style={styles.buttonText}>Ver Detalhes</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <View style={styles.contentHeader}>
                <Header name={nameUser} />
            </View>

            <View style={styles.content}>
                <Text style={styles.titlePage}>Relatório de Vendas</Text>
                <Text style={styles.totalText}>Total de Vendas: R$ {relatorio.totalVendas?.toFixed(2)}</Text>
                <FlatList
                    data={detalhes}
                    keyExtractor={(item) => String(item.comanda_id)}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma venda registrada</Text>}
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
