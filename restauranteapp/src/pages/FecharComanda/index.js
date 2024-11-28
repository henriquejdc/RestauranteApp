import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import Toast from 'react-native-toast-message';
import { getComanda } from '../../services/Comandas';
import { useNavigation } from '@react-navigation/native';

export default function FecharComanda() {
    const navigation = useNavigation()

    const [nameUser, setName] = useState('');
    const [comanda, setComanda] = useState(null);

    const getNameUser = async () => {
        const name = await AsyncStorage.getItem('email');
        setName(name);
        const token = await AsyncStorage.getItem('token');
        if (token === null) {
            navigation.navigate('Home');
        }
    };

    const fetchComanda = async () => {
        const comanda_id = await AsyncStorage.getItem('comanda_id');
        const response = await getComanda(comanda_id);
        if (response.status === 200) {
            const comanda = await response.json();
            setComanda(comanda);
            await AsyncStorage.removeItem('comanda_id')
        } else {
            Toast.show({
                type: 'error',
                text1: 'Erro ao buscar comanda. Status: ' + response.status,
            });
        }
    };

    useEffect(() => {
        getNameUser();
        fetchComanda();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentHeader}>
                <Header name={nameUser} />
            </View>

            <View style={styles.content}>
                {comanda ? (
                    <View style={styles.comandaInfo}>
                        <Text style={styles.comandaText}>
                            <Text style={styles.bold}>Mesa: </Text>
                            {comanda.mesa_id}
                        </Text>
                        <Text style={styles.comandaText}>
                            <Text style={styles.bold}>Status: </Text>
                            {comanda.status}
                        </Text>
                        <Text style={styles.comandaText}>
                            <Text style={styles.bold}>Total: </Text>
                            R$ {comanda.total_comanda.toFixed(2)}
                        </Text>
                        <FlatList
                            data={comanda.detalhes_itens}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item }) => (
                                <View style={styles.itemContainer}>
                                    <Text style={styles.comandaText}>
                                        <Text style={styles.bold}>Item: </Text>
                                        {item.nome_item}
                                    </Text>
                                    <Text style={styles.comandaText}>
                                        <Text style={styles.bold}>Quantidade: </Text>
                                        {item.quantidade}
                                    </Text>
                                    <Text style={styles.comandaText}>
                                        <Text style={styles.bold}>Total: </Text>
                                        R$ {item.total_item.toFixed(2)}
                                    </Text>
                                </View>
                            )}
                        />
                    </View>
                ) : (
                    <Text style={styles.loadingText}>Carregando comanda...</Text>
                )}

                <TouchableOpacity
                    style={styles.button2}
                    onPress={async () => navigation.navigate('Home')}
                >
                    <Text style={styles.buttonText}>Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00693E',
    },
    contentHeader: {
        marginBottom: 10,
    },
    content: {
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 16,
    },
    comandaInfo: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    comandaText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    bold: {
        fontWeight: 'bold',
    },
    itemContainer: {
        marginTop: 10,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#e6e6e6',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginVertical: 20,
    },
    button2: {
        position: 'absolute',
        backgroundColor: '#00693E',
        borderRadius: 50,
        paddingVertical: 8,
        width: '60%',
        alignSelf: 'center',
        bottom: '10%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});
