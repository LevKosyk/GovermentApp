import { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {  StyleSheet, useWindowDimensions, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigationContainerRef } from '@react-navigation/native';


import { AppContext } from '../Provider/AppContextProvider';
import LoginScreen from '../Screens/LoginScreen';
import RegisterScreen from '../Screens/RegisterScreen';
import SettingsScreen from "../Screens/SettingsScreen";
import LogoutScreen from '../AditionalyScreens/LogoutScreen'
import StackScreenComponent from '../AditionalComponents/StackScreenComponent'



const Drawer = createDrawerNavigator()

export default function StackScreen() {
    const { theme } = useContext(AppContext)
    const dimensions = useWindowDimensions();
    const [isAuthenticated, setIsAuntificated] = useState(false);
    const navigationRef = useNavigationContainerRef();

    useEffect(() => {
        const checkAuth = async () => {
            const status = await AsyncStorage.getItem('Authorized');
            setIsAuntificated(!!status);
        };
        checkAuth();

        const unsubscribe = navigationRef.addListener('state', checkAuth);
        return unsubscribe;
    }, [navigationRef]);


    return (
        <NavigationContainer ref={navigationRef}>
            <Drawer.Navigator initialRouteName="HomeScreen" screenOptions={{
                drawerActiveTintColor: theme.colors.background,
                drawerActiveBackgroundColor: theme.colors.buttonColor,
                drawerLabelStyle: {
                    color: theme.colors.secondaryText,
                },
                drawerStyle: {
                    backgroundColor: theme.colors.background,
                    width: 240,
                },
                drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
                headerTitleStyle: { color: theme.colors.secondaryText },
                headerTintColor: theme.colors.secondaryText,
                headerStyle: { backgroundColor: theme.colors.background },
            }} >
                <Drawer.Screen name="HomeScreen" component={StackScreenComponent} />
                <Drawer.Screen name="Settings" component={SettingsScreen} />
                {!isAuthenticated && <Drawer.Screen name="Login" component={LoginScreen} />}
                {!isAuthenticated && <Drawer.Screen name="Register" component={RegisterScreen} />}
                {isAuthenticated && <Drawer.Screen name="Log-out" component={LogoutScreen} />}
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

