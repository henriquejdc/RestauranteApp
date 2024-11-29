import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    SafeAreaView,
    Picker,
} from 'react-native';
import { getItensCardapio, postItemCardapio, deleteItemCardapio } from '../../services/ItensCardapio';
import Toast from 'react-native-toast-message';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/BackButton';

export default function ItensCardapio() {
    const [itens, setItens] = useState([]);
    const [novoItem, setNovoItem] = useState({
        nome: '',
        categoria: 'prato',
        preco: '',
    });
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

    const fetchItens = async () => {
        const response = await getItensCardapio();
        if (response.status === 200) {
            const data = await response.json();
            setItens(data);
        }
    };

    const criarItem = async () => {
        if (novoItem.nome && novoItem.categoria && novoItem.preco) {
            const response = await postItemCardapio(novoItem);
            if (response.status === 201) {
                Toast.show({
                    type: 'success',
                    text1: 'Mesa adicionada',
                });
                setNovoItem({ nome: '', categoria: 'prato', preco: '' });
                fetchItens();
            } else {
                Toast.show({
                    type: 'errosr',
                    text1: 'Ocorreu um erro. Status: ' + response.status,
                });
            }
        }
    };

    const excluirItem = async (id) => {
        const response = await deleteItemCardapio(id);
        if (response.status === 200) {
            Toast.show({
                type: 'success',
                text1: 'Item removido',
            });
            fetchItens();
        } else {
            Toast.show({
                type: 'error',
                text1: 'Seu item esta associado a uma ordem!',
            });
        }
    };

    useEffect(() => {
        fetchItens();
        getNameUser();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <View style={styles.contentHeader}>
                <Header name={nameUser} />
            </View>

            <View style={styles.content}>
                <Text style={styles.titlePage}>Itens do Cardápio</Text>
                <FlatList
                    data={itens}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text>{`${item.nome} (${item.categoria}) - R$ ${item.preco}`}</Text>
                            <TouchableOpacity onPress={() => excluirItem(item.id)}>
                                <Text style={styles.deleteText}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Nome do item"
                    value={novoItem.nome}
                    onChangeText={(text) => setNovoItem({ ...novoItem, nome: text })}
                />
                <Picker
                    selectedValue={novoItem.categoria}
                    onValueChange={(itemValue) => setNovoItem({ ...novoItem, categoria: itemValue })}
                    style={styles.input}
                >
                    <Picker.Item label="Prato" value="prato" />
                    <Picker.Item label="Bebida" value="bebida" />
                </Picker>
                <TextInput
                    style={styles.input}
                    placeholder="Preço"
                    value={novoItem.preco}
                    keyboardType="numeric"
                    onChangeText={(text) => setNovoItem({ ...novoItem, preco: text })}
                />
                <TouchableOpacity style={styles.button} onPress={criarItem}>
                    <Text style={styles.buttonText}>Adicionar Item</Text>
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
