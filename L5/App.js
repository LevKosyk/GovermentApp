import { useEffect, useState } from "react";
import StackScreen from "./src/components/AditionalyScreens/StackScreens";
import AppProvider from './src/components/Provider/AppContextProvider';
import CheakPhotosToSend from "./src/components/AditionalComponents/CheakPhotosToSend";
import { View } from "react-native";
import Loader from "./src/components/AditionalComponents/Loader";
import { ActivityIndicator } from "react-native-paper";

export default function App() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const syncPhotos = async () => {
            setLoading(true);
            console.log('CheakPhotosToSend');
            await CheakPhotosToSend();
            setLoading(false);
        };
        syncPhotos();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1 }}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <AppProvider>
            <StackScreen />
        </AppProvider>
    );
}