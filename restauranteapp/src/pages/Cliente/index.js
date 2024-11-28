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
import BackButton from '../../components/BackButton';
import Header from '../../components/Header';
import Toast from 'react-native-toast-message';
import { getMesas } from '../../services/Mesas';
import { getItensCardipio } from '../../services/ItensCardapio';
import { postComanda, putComandaAdicionaItem, putComandaFechar } from '../../services/Comandas';
import { useNavigation } from '@react-navigation/native';

export default function MesasLivres() {
    const navigation = useNavigation()
    const [nameUser, setName] = useState('')
    const [mesas, setMesas] = useState([]);
    const [itensCardapio, setItensCardapio] = useState([]);
    const [mesaSelecionada, setMesaSelecionada] = useState(null);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('pratos');
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [quantidade, setQuantidade] = useState(1);

    const getNameUser = async () => {
        const name = await AsyncStorage.getItem('email')
        setName(name);
        const token = await AsyncStorage.getItem('token');
        if (token === null) {
            navigation.navigate('Home')
        }
    }

    const fetchMesasLivres = async () => {
        var mesasLivres = [];
        const comanda_id = await AsyncStorage.getItem('comanda_id');

        if (comanda_id) {
            const mesaCache = await AsyncStorage.getItem('mesa');
            const mesa = JSON.parse(mesaCache)
            setMesaSelecionada(mesa.id);
            mesasLivres = [JSON.parse(mesaCache)];
        } else {
            const response = await getMesas("livre");
            if (response.status === 200) {
                mesasLivres = await response.json();
            }
            else {
                Toast.show({
                    type: 'error',
                    text1: 'Ocorreu um erro ao buscar mesas. Status: ' + response.status,
                });
            }
        }
        setMesas(mesasLivres);
    };

    const fetchItensCardapio = async () => {

        var pratos = [];
        var bebidas = [];

        const response_pratos = await getItensCardipio("prato");
        if (response_pratos.status === 200) {
            pratos = await response_pratos.json();
        }
        else {
            Toast.show({
                type: 'error',
                text1: 'Ocorreu um erro ao buscar pratos. Status: ' + response_pratos.status,
            });
        }

        const response_bebidas = await getItensCardipio("bebida");
        if (response_bebidas.status === 200) {
            bebidas = await response_bebidas.json();
        }
        else {
            Toast.show({
                type: 'error',
                text1: 'Ocorreu um erro ao buscar bebidas. Status: ' + response_bebidas.status,
            });
        }

        const cardapio = {
            pratos,
            bebidas,
        };
        setItensCardapio(cardapio[categoriaSelecionada]);
    };

    const handleSelecionarMesa = async (mesa) => {
        setMesaSelecionada(mesa.id);
        await AsyncStorage.setItem('mesa', JSON.stringify(mesa));
    };

    const handleFecharComanda = async () => {
        const comanda_id = await AsyncStorage.getItem('comanda_id');
        const response = await putComandaFechar(comanda_id);
        if (response.status === 200) {
            navigation.navigate('Fechar Comanda');
        }
        else {
            const response_json = await response.json();
            Toast.show({
                type: 'error',
                text1: 'Ocorreu um erro ao fechar comanda. Status: ' + response.status,
                text2: response_json.error,
            });
        }
    };

    const handleAdicionarItem = async () => {

        if (!mesaSelecionada) {
            Toast.show({
                type: 'error',
                text1: 'Selecione uma mesa primeiro!',
            });
            return;
        }

        if (!itemSelecionado) {
            Toast.show({
                type: 'error',
                text1: 'Selecione um item do cardápio!',
            });
            return;
        }

        var comanda_id = await AsyncStorage.getItem('comanda_id');
        const user = await AsyncStorage.getItem('user');

        if (comanda_id === null) {
            const response = await postComanda(mesaSelecionada, user);
            if (response.status !== 201) {
                Toast.show({
                    type: 'error',
                    text1: 'Ocorreu um erro ao criar à comanda. Status: ' + response.status,
                });
                return;
            }
            const comanda = await response.json();
            comanda_id = comanda.id;
            await AsyncStorage.setItem('comanda_id', comanda_id);
        }

        const response_item = await putComandaAdicionaItem(comanda_id, itemSelecionado.id, quantidade);
        if (response_item.status !== 201) {
            Toast.show({
                type: 'error',
                text1: 'Ocorreu um erro ao adicionar item à comanda. Status: ' + response_item.status,
            });
            return;
        }

        Toast.show({
            type: 'success',
            text1: `Item "${itemSelecionado.nome}" adicionado à comanda.`,
        });

        setItemSelecionado(null);
        setQuantidade(1);
        fetchMesasLivres();
    };

    const aumentarQuantidade = () => setQuantidade((prev) => Math.min(prev + 1, 99));
    const diminuirQuantidade = () => setQuantidade((prev) => Math.max(prev - 1, 1));

    useEffect(() => {
        getNameUser();
        fetchMesasLivres();
        fetchItensCardapio();
    }, [categoriaSelecionada]);

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />

            <View style={styles.contentHeader}>
                <Header name={nameUser} />
            </View>

            <View style={styles.content}>

                <Text style={styles.title}>Selecione uma Mesa</Text>
                <FlatList
                    data={mesas}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.mesaButton,
                                mesaSelecionada === item.id && styles.mesaButtonSelected,
                            ]}
                            onPress={() => handleSelecionarMesa(item)}
                        >
                            <Text style={styles.mesaText}>Mesa {item.numero}</Text>
                        </TouchableOpacity>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />

                <Text style={styles.title}>Itens do Cardápio</Text>
                <View style={styles.categoriaContainer}>
                    <TouchableOpacity
                        style={[
                            styles.categoriaButton,
                            categoriaSelecionada === 'pratos' && styles.categoriaButtonSelected,
                        ]}
                        onPress={() => setCategoriaSelecionada('pratos')}
                    >
                        <Text style={styles.categoriaText}>Pratos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.categoriaButton,
                            categoriaSelecionada === 'bebidas' && styles.categoriaButtonSelected,
                        ]}
                        onPress={() => setCategoriaSelecionada('bebidas')}
                    >
                        <Text style={styles.categoriaText}>Bebidas</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={itensCardapio}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.itemButton,
                                itemSelecionado?.id === item.id && styles.itemButtonSelected,
                            ]}
                            onPress={() => setItemSelecionado(item)}
                        >
                            <Text style={styles.itemText}>
                                {item.nome} - R$ {item.preco}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                {itemSelecionado && (
                    <View style={styles.quantidadeContainer}>
                        <Text style={styles.quantidadeLabel}>Quantidade:</Text>
                        <TouchableOpacity
                            style={styles.quantidadeButton}
                            onPress={diminuirQuantidade}
                        >
                            <Text style={styles.quantidadeButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantidadeText}>{quantidade}</Text>
                        <TouchableOpacity
                            style={styles.quantidadeButton}
                            onPress={aumentarQuantidade}
                        >
                            <Text style={styles.quantidadeButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {itemSelecionado && (
                    <TouchableOpacity style={styles.enviarButton} onPress={handleAdicionarItem}>
                        <Text style={styles.enviarButtonText}>Adicionar Item</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.fecharButton} onPress={handleFecharComanda}>
                    <Text style={styles.enviarButtonText}>Fechar Comanda</Text>
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
        paddingEnd: '5%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
    },
    mesaButton: {
        backgroundColor: '#00693E',
        padding: 15,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    mesaButtonSelected: {
        backgroundColor: '#004d2a',
    },
    mesaText: {
        color: '#fff',
        fontSize: 16,
    },
    categoriaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    categoriaButton: {
        backgroundColor: '#00693E',
        padding: 10,
        borderRadius: 5,
    },
    categoriaButtonSelected: {
        backgroundColor: '#004d2a',
    },
    categoriaText: {
        color: '#fff',
        fontSize: 16,
    },
    itemButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        marginVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    itemButtonSelected: {
        backgroundColor: '#357a38',
    },
    itemText: {
        color: '#fff',
        fontSize: 16,
    },
    quantidadeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    quantidadeLabel: {
        fontSize: 16,
        marginRight: 10,
    },
    quantidadeButton: {
        backgroundColor: '#00693E',
        borderRadius: 5,
        padding: 10,
        marginHorizontal: 5,
    },
    quantidadeButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    quantidadeText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 5,
    },
    enviarButton: {
        backgroundColor: '#00693E',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    fecharButton: {
        backgroundColor: '#FF0000',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    enviarButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
