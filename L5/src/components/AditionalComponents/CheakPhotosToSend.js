import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

import { deletePhoto, fetchPhoto } from '../../SqlliteDb/database';
import { FetchSendPhoto, getInternetConnection, getServerStatus } from "../../service/AppService";

const base64ToUri = async (base64String, fileName = 'image.jpg') => {
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, base64String, {
        encoding: FileSystem.EncodingType.Base64,
    });
    return fileUri;
};

export default async function CheakPhotosToSend() {

    const data = await fetchPhoto();

    if (data && data.length > 0) {
        const isConnected = await getInternetConnection();
        const serverStatus = await getServerStatus();

        if (isConnected && serverStatus) {
            for (let i = 0; i < data.length; i++) {
                try {
                    const uri = await base64ToUri(data[i].imageBase64, `photo_${data[i].id}.jpg`);
                    await FetchSendPhoto(
                        uri,
                        data[i].date,
                        data[i].situation,
                        data[i].longitude,
                        data[i].latitude,
                        data[i].description
                    );
                    await deletePhoto(data[i].id);
                } catch (error) {
                    console.error("Error syncing photo:", error);
                }
            }
        } else {
            Alert.alert("No Internet Connection", "Please check your internet connection and try again.");
        }
    }
    return true
}