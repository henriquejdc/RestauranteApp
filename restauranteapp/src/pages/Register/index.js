import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import * as Animatable from 'react-native-animatable'
import base64 from 'react-native-base64'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { postLogin } from '../../services/Autenticacao/Post';
import Toast from 'react-native-toast-message';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import BackButton from '../../components/BackButton';

export default function SignIn() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const navigation = useNavigation()

  React.useEffect(() => {
    getUsername()
    getPassword()
  }, [])

  async function getUsername() {
    setUsername(await AsyncStorage.getItem('username'))
  }
  async function getPassword() {
    setPassword(await AsyncStorage.getItem('password'))
  }

  const getSession = async () => {
    if (!username) {
      Toast.show({
        type: 'error',
        text1: 'Você precisa inserir o username!',
      });
      return
    }
    if (!password) {
      Toast.show({
        type: 'error',
        text1: 'Você precisa inserir a senha!',
      });
      return
    }
    setLoading(true);
    const encoded = base64.encode(username + ":" + password);
    const response = await postLogin(encoded)
    const json = await response.json();
    console.log(json)
    if (response.ok) {
      await AsyncStorage.setItem('session', json.session)
      await AsyncStorage.setItem('name', json.name)
      if (isChecked) {
        await AsyncStorage.setItem('username', username)
        await AsyncStorage.setItem('password', password)
      }
      else {
        await AsyncStorage.removeItem('username')
        await AsyncStorage.removeItem('password')
      }
      navigation.navigate('Home')
    } else {
      Toast.show({
        type: 'error',
        text1: 'Ocorreu um erro',
        text2: json.detail
      });
    }
    setLoading(false);
  }
  return (
    <View style={styles.container}>
      <BackButton />

      <Animatable.View animation='fadeInLeft' delay={500} style={styles.containerHeader}>
        <Text style={styles.message}>Bem-vindo(a)</Text>
      </Animatable.View>

      <Animatable.View animation='fadeInUp' style={styles.containerForm}>
        <Text style={styles.title}>Email</Text>
        <TextInput
          onChangeText={text => setUsername(text)} defaultValue={username} placeholder='Email' style={styles.input} autoCapitalize='none' />

        <Text style={styles.title}>Senha</Text>
        <View style={styles.inputPassword}>
          <TextInput
            onChangeText={text => setPassword(text)} defaultValue={password} placeholder='Senha' style={styles.input} secureTextEntry={secureTextEntry} ico />
          <Pressable onPress={() => setSecureTextEntry(!secureTextEntry)}>
            <FontAwesome name={secureTextEntry ? 'eye' : 'eye-slash'} size={20} style={{ paddingRight: 20 }} />
          </Pressable>
        </View>
        <TouchableOpacity style={isLoading ? styles.buttonLoading : styles.button} onPress={getSession} disabled={isLoading}>
          {isLoading ? <ActivityIndicator size={40} style={styles.activityIndicator} color="#000000" />
            : <Text style={styles.buttonText}>
              Registrar
            </Text>
          }
        </TouchableOpacity>
        
      </Animatable.View>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00693E'
  },
  containerHeader: {
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%'
  },
  message: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff'
  },
  containerForm: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopEndRadius: 25,
    paddingStart: '5%',
    paddingEnd: '5%'
  },
  title: {
    fontSize: 20,
    marginTop: 28
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    marginBottom: 12,
    fontSize: 16,
    width: '95%'
  },
  button: {
    backgroundColor: '#00693E',
    width: '100%',
    borderRadius: 4,
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonLoading: {
    width: '100%',
    paddingVertical: 8,
    marginTop: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  textLinkTerms: {
    textDecorationLine: 'underline',
    color: 'blue'
  },
  textTerms: {
    marginTop: 10
  },
  checkbox: {
    margin: 8,
  },
  paragraph: {
    fontSize: 15,
  },
  checkboxSave: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputPassword: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})