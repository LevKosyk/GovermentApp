import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Alert, View, ActivityIndicator, StyleSheet } from "react-native";
import * as FileSystem from 'expo-file-system';

import { createTable, deletePhoto, fetchPhoto } from './src/SqlliteDb/database';
import AppProvider from './src/components/Provider/AppContextProvider';
import { FetchSendPhoto, getInternetConnection, getServerStatus } from "./src/service/AppService";

import LoginScreen from './src/components/Screens/LoginScreen';
import RegisterScreen from './src/components/Screens/RegisterScreen';
import DayDetailsScreen from './src/components/Screens/DayDetailsScreen';
import CalendarScreen from './src/components/Screens/CalendarScreen';
import MainScreen from './src/components/Screens/MainScreen';
import CameraScreen from './src/components/Screens/CameraScreen';
import SettingsScreen from "./src/components/Screens/SettingsScreen";

const Stack = createStackNavigator();

// функция base64 → URI
const base64ToUri = async (base64String, fileName = 'image.jpg') => {
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, base64String, {
        encoding: FileSystem.EncodingType.Base64,
    });
    return fileUri;
};

export default function App() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const init = async () => {
            await createTable();

            setLoading(true);
            const data = await fetchPhoto();
            

            if (data && data.length > 0) {
                const isConnected = await getInternetConnection();
                const serverStatus = await getServerStatus();

                if (serverStatus) {
                    for (let i = 0; i < data.length; i++) {
                        try {
                            const uri = await base64ToUri(data[i].imageBase64, `photo_${data[i].id}.jpg`);
                            await FetchSendPhoto(uri, data[i].date, data[i].situation, data[i].longitude, data[i].latitude, data[i].description);
                            await deletePhoto(data[i].id);
                        } catch (error) {
                            console.error("Error syncing photo:", error);
                        }
                    }
                } else {
                    Alert.alert("No Internet Connection", "Please check your internet connection and try again.");
                }
            }
            setLoading(false);
        };

        init();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    return (
        <AppProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="MainScreen" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                    <Stack.Screen name="DayDetailsScreen" component={DayDetailsScreen} />
                    <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
                    <Stack.Screen name="MainScreen" component={MainScreen} />
                    <Stack.Screen name="CameraScreen" component={CameraScreen} />
                    <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </AppProvider>
    );
}

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    }
});
