import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={handleBack} style={styles.button}>
      <Text style={styles.buttonText}>Voltar</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  buttonText: {
    color: '#00693E',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BackButton;
