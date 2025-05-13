import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LogoutScreen({ navigation }) {
    useEffect(() => {
        const logout = async () => {
            await AsyncStorage.removeItem('Authorized');
            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            });
        };
        logout();
    }, [navigation]);

    return null;
}