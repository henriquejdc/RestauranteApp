import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import Notification from '../../components/Notification';

export default function Welcome() {
    const navigation = useNavigation()
    const fetchUpdate = async () => {
        try {
            const update = await Updates.checkForUpdateAsync();

            if (update.isAvailable) {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
            }
        } catch (error) {
            // You can also add an alert() to see the error message in case of an error when fetching updates.
        }
    }
    React.useEffect(() => {
        fetchUpdate();
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.containerLogo}>
                <Animatable.Image
                    animation='flipInY'
                    source={require('../../assets/logo_fundo.png')}
                    style={{ width: '110%', height: '110%' }}
                    resizeMode='contain' />
            </View>
            <Animatable.View
                style={styles.containerForm}
                animation='fadeInUp'
                delay={600}
            >
                {/* <Notification /> */}
                <Text style={styles.title}>Restaurante Chapecó</Text>

                <TouchableOpacity style={styles.button} onPress={async () => await AsyncStorage.getItem('session') ? navigation.navigate('Home') : navigation.navigate('SignIn')}>
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button2} onPress={async () => await AsyncStorage.getItem('session') ? navigation.navigate('Home') : navigation.navigate('Register')}>
                    <Text style={styles.buttonText}>Registrar</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#00693E"
    },
    containerLogo: {
        flex: 2,
        backgroundColor: "#00693E",
        alignItems: 'center',
        justifyContent: 'center'
    },
    containerForm: {
        flex: 1,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 28,
        marginBottom: 12
    },
    text: {
        color: '#a1a1a1'
    },
    button: {
        position: 'absolute',
        backgroundColor: '#00693E',
        borderRadius: 50,
        paddingVertical: 8,
        width: '60%',
        alignSelf: 'center',
        bottom: '15%',
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
        bottom: '30%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold'
    }
})