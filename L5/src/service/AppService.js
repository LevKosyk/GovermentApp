import axios from "axios";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import NetInfo from "@react-native-community/netinfo";

import { insertPhoto } from "../SqlliteDb/database";
import CheakPhotosToSend from "../components/AditionalComponents/CheakPhotosToSend";



const API_URL = 'http://192.168.0.104:5138/api';
const API_URL_CLOUDINARY = 'https://api.cloudinary.com/v1_1/dzs2ayj8k/image/upload';

export const getInternetConnection = async () => {
    const state = await NetInfo.fetch();
    return state.isConnected;
};

export const getServerStatus = async () => {
    try {
        const result = await axios.get(`http://192.168.0.104:5138/health`);
        return result.status === 200; 
    } catch (error) {
        console.error("Error fetching server status:", error);
        return false; 
    }
};

const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        Alert.alert("Permission Denied", "Access to location is required.");
        return null;
    }
    const currentLocation = await Location.getCurrentPositionAsync({});
    return {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
    };
};

export const FetchLogin = async (login, password) => {
    try {
        const response = await axios.post(
            `${API_URL}/users/login`,
            { login, password },
            { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
            console.log("Login Success:", response.status);
            await AsyncStorage.setItem("Authorized", login);
        } else {
            Alert.alert("Login failed", "Invalid credentials", [{ text: "OK" }]);
        }
    } catch (error) {
        console.error("Error in FetchLogin:", error.response ? error.response.data : error);
        Alert.alert("Error", "Something went wrong", [{ text: "OK" }]);
    }
};

export const FetchRegister = async (Login, Password, Name, SecondName) => {
    try {
        const response = await axios.post(
            `${API_URL}/users/register`,
            { Login: Login, Password: Password, Name: Name, SecondName: SecondName },
            { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
            console.log("Registration Success:", response.status);
        } else {
            Alert.alert("Registration failed", "User already exists", [{ text: "OK" }]);
        }
    } catch (error) {
        console.error("Error in FetchRegister:", error.response ? error.response.data : error);
        Alert.alert("Error", "Something went wrong", [{ text: "OK" }]);
    }
};

export const FetchSendPhoto = async (uri, date, situation, longitude, latitude, description) => {
    try {
        const isConnected = await getInternetConnection();
        const serverStatus = await getServerStatus();
        const login = await AsyncStorage.getItem("Authorized");

        if (!login) {
            Alert.alert("Error", "User not authorized");
            return;
        }

        try {
            await CheakPhotosToSend();
        } catch (err) {
            Alert.alert("Error", "Failed to sync local photos. Please try again.");
            return;
        }

        if (!date || !longitude || !latitude) {
            const location = await getLocation();
            if (!location) {
                Alert.alert("Error", "Could not get location");
                return;
            }
            date = new Date().toISOString();
            longitude = location.longitude;
            latitude = location.latitude;
        }

        if (serverStatus && isConnected) {
            let url = null;
            try {
                const formDataCloud = new FormData();
                formDataCloud.append('file', { uri: uri, name: `photo${login}.jpg`, type: 'image/jpg' });
                formDataCloud.append('upload_preset', 'Testing');
                formDataCloud.append('cloud_name', 'dzs2ayj8k');

                const response = await fetch(API_URL_CLOUDINARY, {
                    method: 'POST',
                    body: formDataCloud,
                });
                const data = await response.json();
                if (data && data.secure_url) {
                    url = data.secure_url;
                    console.log("Image URL:", url);
                } else {
                    Alert.alert("Error", "Image upload failed");
                    return;
                }
            } catch (error) {
                console.log("Error uploading to Cloudinary:", error);
                Alert.alert("Error", "Image upload failed");
                return;
            }

            if (!url) {
                Alert.alert("Error", "No URL generated from image upload");
                return;
            }

            const payload = {
                Url: url,
                Date: date,
                Login: login,
                Longitude: longitude ? longitude.toString() : '',
                Latitude: latitude ? latitude.toString() : '',
                Description: description || '',
                Situation: situation ? situation.toString() : ''
            };

            try {
                const response = await axios.post(`${API_URL}/photo/sendPhoto`, payload, {
                    headers: { "Content-Type": "application/json" },
                    timeout: 15000,
                });

                if (response.status === 200) {
                    console.log("Photo sent successfully!");
                    Alert.alert('Photo sent successfully!');
                } else {
                    Alert.alert("Error", "Failed to send photo", [{ text: "OK" }]);
                }
            } catch (error) {
                console.error("Error sending photo to server:", error.response ? error.response.data : error);
                Alert.alert("Error", "Failed to send photo to server", [{ text: "OK" }]);
            }
        } else {
            const location = await getLocation();
            if (!location) {
                Alert.alert("Error", "Could not get location to save photo locally");
                return;
            }
            await insertPhoto(uri, new Date().toISOString(), location, situation, description);
            Alert.alert("No Internet", "Photo will be sent later", [{ text: "OK" }]);
        }
    } catch (error) {
        console.error("Error in FetchSendPhoto:", error.response ? error.response.data : error);
        Alert.alert("Error", "Something went wrong", [{ text: "OK" }]);
    }
};

export const FetchGetDaysWithMarkersByMonth = async (login, month, year) => {
    try {
        const response = await axios.get(`${API_URL}/photo/getDaysWithMarkers`, {
            params: { month: month, year: year, login: login },
        });

        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            console.error("Error fetching days with markers:", response.status);
            return []; 
        }
    } catch (error) {
        console.error("Error in FetchGetDaysWithMarkers:", error.response ? error.response.data : error);
        return []; 
    }
};

export const FetchDataByDay = async (day, login) => {
    try {
        const response = await axios.get(`${API_URL}/photo/getDataByDay`, {
            params: { date: day, login: login },
        });

        if (response.status === 200) {
            return response.data || [];
        } else {
            console.error("Error fetching data by day:", response.status);
        }
    } catch (error) {
        console.error("Error in FetchDataByDay:", error.response ? error.response.data : error);
    }
};

export const FetchDataByDayForCrime = async (day, login) => {
    try {
        const response = await axios.get(`${API_URL}/photo/getDataByDayForCrime`, {
            params: { date: day, login: login },
        });

        if (response.status === 200) {
            return response.data || [];
        } else {
            console.error("Error fetching data by day:", response.status);
        }
    } catch (error) {
        console.error("Error in FetchDataByDay:", error.response ? error.response.data : error);
    }
};
