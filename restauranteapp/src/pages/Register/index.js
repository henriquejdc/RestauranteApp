import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import * as Animatable from 'react-native-animatable'
import { useNavigation } from '@react-navigation/native';
import { postRegister } from '../../services/Autenticacao';
import Toast from 'react-native-toast-message';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import BackButton from '../../components/BackButton';

export default function Login() {
  const [name, setname] = React.useState('');
  const [email, setemail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const navigation = useNavigation()

  React.useEffect(() => {}, [])

  const getSession = async () => {
    if (!name) {
      Toast.show({
        type: 'error',
        text1: 'Você precisa inserir o email!',
      });
      return
    }
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
    const response = await postRegister(name, email, password)
    if (response.status === 201) {
      navigation.navigate('Login');
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
        <Text style={styles.title}>Nome</Text>
        <TextInput
          onChangeText={text => setname(text)} defaultValue={email} placeholder='Nome' style={styles.input} autoCapitalize='none' />

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