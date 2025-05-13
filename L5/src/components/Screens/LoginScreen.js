import React, { useState, useContext } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AppContext } from '../Provider/AppContextProvider';
import { FetchLogin } from '../../service/AppService';

export default LoginScreen = ({ navigation }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const { theme } = useContext(AppContext);

    const handleLogin = async () => {
        if (!login.trim() || !password.trim()) {
            Alert.alert('Error', 'Enter login and password');
            return;
        }
        const storedPassword = await AsyncStorage.getItem(login);
        if (storedPassword === password) {
            await AsyncStorage.setItem('Authorized', login);
            await FetchLogin(login, password);
            Alert.alert('Success', 'All ok');
            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            });
        } else {
            Alert.alert('Error', 'Incorrect login or password');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
                    <Text style={[styles.title, { color: theme.colors.secondaryText }]}>Login</Text>

                    <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Login</Text>
                    <TextInput
                        value={login}
                        onChangeText={setLogin}
                        style={[styles.input, { color: theme.colors.secondaryText, backgroundColor: theme.colors.surface }]}
                        placeholder="Enter login"
                        placeholderTextColor={theme.colors.text}
                    />

                    <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Password</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        style={[styles.input, { color: theme.colors.textInput, backgroundColor: theme.colors.surface, paddingRight: 40, borderRadius: 10, elevation: 2, }]}
                        placeholder="Enter password"
                        secureTextEntry={secureTextEntry}
                        placeholderTextColor={theme.colors.text}
                    />

                    <TouchableOpacity
                        onPress={() => setSecureTextEntry(!secureTextEntry)}
                        style={{ position: 'absolute', right: 23, top: '51%', transform: [{ translateY: -12 }], padding: 8, }}
                    >
                        <Ionicons name="eye" size={24} color={theme.colors.secondaryText} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLogin} style={[styles.button, styles.loginButton]}>
                        <Text style={[styles.buttonText]}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')} style={[styles.button, styles.registerButton]}>
                        <Text style={[styles.buttonText]}>Register</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        alignSelf: 'flex-start',
        marginLeft: 10,
        marginBottom: 5,
    },
    input: {
        width: '100%',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        width: '100%',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5,
    },
    loginButton: {
        backgroundColor: '#007bff',
    },
    registerButton: {
        backgroundColor: '#28a745',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});