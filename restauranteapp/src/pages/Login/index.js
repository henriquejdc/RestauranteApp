import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import * as Animatable from 'react-native-animatable'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { postLogin } from '../../services/Autenticacao';
import Checkbox from 'expo-checkbox';
import Toast from 'react-native-toast-message';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import BackButton from '../../components/BackButton';

export default function Login() {
  const [email, setemail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [isChecked, setChecked] = React.useState(true);
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const navigation = useNavigation()

  React.useEffect(() => {
    getemail()
    getPassword()
  }, [])

  async function getemail() {
    setemail(await AsyncStorage.getItem('email'))
  }
  async function getPassword() {
    setPassword(await AsyncStorage.getItem('password'))
  }

  const getSession = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Você precisa inserir o email!',
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
    const response = await postLogin(email, password);
    if (response.status === 200) {
      const json = await response.json();
      await AsyncStorage.setItem('token', json.token)
      await AsyncStorage.setItem('user', json.user)
      await AsyncStorage.setItem('name', json.nome)

      if (isChecked) {
        await AsyncStorage.setItem('email', email)
        await AsyncStorage.setItem('password', password)
      }
      else {
        await AsyncStorage.removeItem('email')
        await AsyncStorage.removeItem('password')
      }
      navigation.navigate('Home')
    } else {
      Toast.show({
        type: 'error',
        text1: 'Ocorreu um erro. Status: ' + response.status,
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
          onChangeText={text => setemail(text)} defaultValue={email} placeholder='Email' style={styles.input} autoCapitalize='none' />

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
              Acessar
            </Text>
          }
        </TouchableOpacity>
        <View style={styles.checkboxSave}>
          <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
          <Text style={styles.paragraph}>Salvar login</Text>
        </View>

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