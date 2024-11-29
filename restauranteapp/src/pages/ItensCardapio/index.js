import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Picker,
} from 'react-native';
import { getItensCardapio, postItemCardapio, deleteItemCardapio } from '../../services/ItensCardapio';
import Toast from 'react-native-toast-message';
import Header from '../../components/Header';

export default function ItensCardapio() {
    const [itens, setItens] = useState([]);
    const [novoItem, setNovoItem] = useState({
        nome: '',
        categoria: 'prato',
        preco: '',
    });

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
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Itens do Cardápio</Text>
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
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
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
    button: { backgroundColor: '#00693E', padding: 15, borderRadius: 5 },
    buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});
