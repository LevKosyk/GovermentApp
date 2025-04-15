import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { AppContext } from '../Provider/AppContextProvider';
import Navbar from '../AditionalyScreens/Navbar';
import { CustomDarkTheme, CustomLightTheme } from '../Theme/Themes';
import { StatusBar } from 'expo-status-bar';

const SettingsScreen = ({ navigation }) => {
    const { theme, changeTheme } = useContext(AppContext);
    const toggleTheme = () => {;
        const newTheme = theme === CustomLightTheme ? CustomDarkTheme : CustomLightTheme;
        changeTheme(newTheme);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Navbar navigation={navigation} />
            <TouchableOpacity 
                onPress={toggleTheme} 
                style={[styles.btnChange, { backgroundColor: theme.colors.primary }]}
            >
                <Text style={[styles.textChangeTheme, { color: theme.colors.text }]}>
                    Change Theme
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    btnChange: {
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '10%',
        borderRadius: 10,
        borderWidth: 2,
    },
    textChangeTheme: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
    },
});

export default SettingsScreen;
