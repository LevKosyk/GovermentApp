import { useState, useContext } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';

import { AppContext } from '../Provider/AppContextProvider';
import Loader from '../AditionalComponents/Loader'
import { FetchRegister } from '../../service/AppService';


export default RegisterScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false)
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState(''); 
    const [surname, setSurname] = useState(''); 
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureTextEntryConfirm, setSecureTextEntryConfirm] = useState(true);
    const { theme } = useContext(AppContext);

    const handleRegister = async () => {
        if (!login.trim() || !password.trim() || !confirmPassword.trim() || !name.trim() || !surname.trim()) {
            Alert.alert('Error', 'Enter all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);

        await FetchRegister(login, password, name, surname); 
        await AsyncStorage.setItem(login, password);
        setLogin('')
        setPassword('')
        setConfirmPassword('')
        setName('');
        setSurname('')
        Alert.alert('Success', 'Account created');
        navigation.navigate("HomeScreen");
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                {loading ? (
                    <Loader />
                ) : (
                    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
                        <Text style={[styles.title, { color: theme.colors.secondaryText }]}>Registration</Text>

                        <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            style={[styles.input, { color: theme.colors.secondaryText, backgroundColor: theme.colors.surface }]}
                            placeholder="Enter your name"
                            placeholderTextColor={theme.colors.secondaryText}
                        />

                        <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Surname</Text>
                        <TextInput
                            value={surname}
                            onChangeText={setSurname}
                            style={[styles.input, { color: theme.colors.secondaryText, backgroundColor: theme.colors.surface }]}
                            placeholder="Enter your surname"
                            placeholderTextColor={theme.colors.secondaryText}
                        />

                        <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Login</Text>
                        <TextInput
                            value={login}
                            onChangeText={setLogin}
                            style={[styles.input, { color: theme.colors.secondaryText, backgroundColor: theme.colors.surface }]}
                            placeholder="Enter login"
                            placeholderTextColor={theme.colors.secondaryText}
                        />

                        <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Password</Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            style={[styles.input, { color: theme.colors.secondaryText, backgroundColor: theme.colors.surface }]}
                            placeholder="Enter password"
                            secureTextEntry={secureTextEntry}
                            placeholderTextColor={theme.colors.secondaryText}
                        />
                        <TouchableOpacity
                            onPress={() => setSecureTextEntry(!secureTextEntry)}
                            style={{ position: 'absolute', right: 23, top: '56.5%', transform: [{ translateY: -12 }], padding: 8, }}
                        >
                            <Ionicons name="eye" size={24} color={theme.colors.secondaryText} />
                        </TouchableOpacity>

                        <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Confirm password</Text>
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={[styles.input, { color: theme.colors.secondaryText, backgroundColor: theme.colors.surface }]}
                            placeholder="Confirm password"
                            secureTextEntry={secureTextEntryConfirm}
                            placeholderTextColor={theme.colors.text}
                        />
                        <TouchableOpacity
                            onPress={() => setSecureTextEntryConfirm(!secureTextEntryConfirm)}
                            style={{ position: 'absolute', right: 23, top: '67.5%', transform: [{ translateY: -12 }], padding: 8, }}
                        >
                            <Ionicons name="eye" size={24} color={theme.colors.secondaryText} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleRegister} style={[styles.button, styles.registerButton]}>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.button, styles.loginButton]}>
                            <Text style={styles.buttonText}>Back to login</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
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
    registerButton: {
        backgroundColor: '#007bff',
    },
    loginButton: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});