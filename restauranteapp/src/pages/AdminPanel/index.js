import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../../components/BackButton';
import Header from '../../components/Header';

export default function AdminPanel() {
    const copa = 'copa';
    const cozinha = 'cozinha';
    const navigation = useNavigation();
    const [nameUser, setName] = React.useState('')
  
    const getNameUser = async () => {
      const name = await AsyncStorage.getItem('name')
      setName(name);
      const token = await AsyncStorage.getItem('token');
      if (token === null) {
          navigation.navigate('Home')
      }
    }
  
    React.useEffect(() => {
      getNameUser();
    }, []);

    const navigateOrdensProducaoCopa = async () => {
        const setor = 'copa';
        navigation.navigate('OrdensProducao', { setor })
    };

    const navigateOrdensProducaoCozinha = async () => {
        const setor = 'cozinha';
        navigation.navigate('OrdensProducao', { setor })
    };

    return (
        <SafeAreaView style={styles.container}>
            <BackButton />
            <View style={styles.contentHeader}>
                <Header name={nameUser} />
            </View>

            <View style={styles.content}>
                <Text style={styles.titlePage}>Painel Administrativo</Text>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Mesa')}>
                    <Text style={styles.buttonText}>Gerenciar Mesas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ItensCardapio')}>
                    <Text style={styles.buttonText}>Gerenciar Itens do Cardápio</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={navigateOrdensProducaoCopa}>
                    <Text style={styles.buttonText}>Ordens de Produção - Copa</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={navigateOrdensProducaoCozinha}>
                    <Text style={styles.buttonText}>Ordens de Produção - Cozinha</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Relatorio')}>
                    <Text style={styles.buttonText}>Relatório de Vendas - Hoje</Text>
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#00693E',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 15,
        width: '95%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});
