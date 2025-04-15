import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppContext } from '../Provider/AppContextProvider';
import { StatusBar } from 'expo-status-bar';
import { CustomLightTheme } from '../Theme/Themes';

const Navbar = ({ navigation, disabled = false }) => {
  const [status, setStatus] = useState(false);
  const { theme, changeTheme } = useContext(AppContext);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const value = await AsyncStorage.getItem('Authorized');
      setStatus(value);
    };
    checkLoginStatus();
  }, []);

  const Logout = async () => {
    if (!disabled) {
      await AsyncStorage.removeItem('Authorized');
      navigation.navigate('LoginScreen');
    }
  };

  const handleNavigeteMainScreen =() =>{
   if (!disabled) {
    navigation.reset({
      index: 0, 
      routes: [{ name: 'MainScreen' }],
    }); 
   }   
  }

  return (
    <View style={[styles.navbar, { backgroundColor: theme.colors.background }]}>


      <TouchableOpacity style={styles.navButton} onPress={() => handleNavigeteMainScreen()}>
        <Ionicons name="home" size={24} color={theme.colors.secondaryText} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navButton, styles.btnChange]} onPress={() => !disabled && navigation.navigate('SettingsScreen')}>
        <Ionicons name="settings" size={24} color={theme.colors.secondaryText} />
      </TouchableOpacity>
      {
        navigation.currentRouteName === 'LoginScreen' || navigation.currentRouteName === 'RegisterScreen' ? (
          <View />
        ) : (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: status ? '#dc3545' : '#007bff' }]}
            onPress={Logout}
          >
            <Text style={[styles.loginText, { color: theme.colors.text }]}>
              {status ? 'Logout' : 'Login'}
            </Text>
          </TouchableOpacity>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 40,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  navText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnChange: {
    marginLeft: '46%',
  },
});

export default Navbar;
