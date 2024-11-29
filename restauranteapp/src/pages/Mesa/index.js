import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView } from 'react-native';
import { getMesas, postMesa, deleteMesa } from '../../services/Mesa';
import Toast from 'react-native-toast-message';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/BackButton';

export default function Mesa() {
    const [mesas, setMesas] = useState([]);
    const [novaMesa, setNovaMesa] = useState('');
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

    const fetchMesas = async () => {
        const response = await getMesas();
        if (response.status === 200) {
            const data = await response.json();
            setMesas(data);
        }
    };

    const criarMesa = async () => {
        if (novaMesa) {
            const response = await postMesa(novaMesa);
            if (response.status === 201) {
                Toast.show({
                    type: 'success',
                    text1: 'Mesa adicionada',
                });
                fetchMesas();
            } else {
                Toast.show({
                    type: 'errosr',
                    text1: 'Ocorreu um erro. Status: ' + response.status,
                });
            }
            setNovaMesa('');
            fetchMesas();
        }
    };

    const excluirMesa = async (id) => {
        const response = await deleteMesa(id);
        if (response.status === 200) {
            Toast.show({
                type: 'success',
                text1: 'Mesa removida',
            });
            fetchMesas();
        } else {
            Toast.show({
                type: 'error',
                text1: 'Sua mesa está associada a uma comanda!',
            });
        }
    };

    useEffect(() => {
        fetchMesas();
        getNameUser();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <View style={styles.contentHeader}>
                <Header name={nameUser} />
            </View>

            <View style={styles.content}>

                <Text style={styles.titlePage}>Mesas</Text>
                <FlatList
                    data={mesas}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text>{`Mesa ${item.numero}`}</Text>
                            <TouchableOpacity onPress={() => excluirMesa(item.id)}>
                                <Text style={styles.deleteText}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Número da nova mesa"
                    value={novaMesa}
                    onChangeText={(text) => {
                        const numericText = text.replace(/[^0-9]/g, '');
                        setNovaMesa(numericText);
                    }}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.button} onPress={criarMesa}>
                    <Text style={styles.buttonText}>Adicionar Mesa</Text>
                </TouchableOpacity>

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
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    deleteText: { color: 'red', fontWeight: 'bold' },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    button: { backgroundColor: '#00693E', padding: 15, borderRadius: 5, marginBottom: 20 },
    buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});
