import React from 'react';
import {
  View, StyleSheet, SafeAreaView, TouchableOpacity, Text
} from 'react-native';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


export default function Home() {
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

  React.useEffect(() => {
    getNameUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentHeader}>
        <Header name={nameUser} />
      </View>
      
      <View style={styles.content}>

        <Text style={styles.titlePage}>Tipo de acesso</Text>
        <TouchableOpacity style={styles.button} onPress={async () => navigation.navigate('Cliente')}>
            <Text style={styles.buttonText}>Cliente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button2} onPress={async () => navigation.navigate('AdminPanel')}>
            <Text style={styles.buttonText}>Funcionário</Text>
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
  button: {
      position: 'absolute',
      backgroundColor: '#00693E',
      borderRadius: 50,
      paddingVertical: 8,
      width: '60%',
      alignSelf: 'center',
      bottom: '30%',
      alignItems: 'center',
      justifyContent: 'center'
  },
  button2: {
      position: 'absolute',
      backgroundColor: '#00693E',
      borderRadius: 50,
      paddingVertical: 8,
      width: '60%',
      alignSelf: 'center',
      bottom: '50%',
      alignItems: 'center',
      justifyContent: 'center'
  },
  buttonText: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold'
  } 
})