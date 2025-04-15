import axios from "axios";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import NetInfo from "@react-native-community/netinfo";
import { fetchPhoto, insertPhoto } from "../SqlliteDb/database";
import * as FileSystem from 'expo-file-system';

const API_URL = "http://192.168.0.103:5138/api";


export const getInternetConnection = async () => {
    const state = await NetInfo.fetch();
    return state.isConnected;
};

export const getServerStatus = async () => {
    try {
        const result = await axios.get('http://192.168.0.103:5138/health');
        console.log(result.status);
        return result.status === 200; 
    } catch (error) {
        return false; 
    }
}

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
            console.log("FetchLogin => Code:", response.status);
            AsyncStorage.setItem("Authorized", login);
        } else {
            Alert.alert("Login failed", "Invalid credentials", [{ text: "OK" }]);
        }
    } catch (error) {
        console.error("Error in FetchLogin:", error.response ? error.response.data : error);
        Alert.alert("Error", "Something went wrong", [{ text: "OK" }]);
    }
};


export const FetchRegister = async (login, password) => {
    try {
        const response = await axios.post(
            `${API_URL}/users/register`,
            { login, password },
            { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
            console.log("FetchRegister => Code:", response.status);
        } else {
            Alert.alert("Register failed", "User already exists", [{ text: "OK" }]);
        }
    } catch (error) {
        console.error("Error in FetchRegister:", error.response ? error.response.data : error);
        Alert.alert("Error", "Something went wrong", [{ text: "OK" }]);
    }
};

export const FetchSendPhoto = async (uri,date, situation, longitude, latitude ,description) => {
    try {
        const isConnected = await getInternetConnection();
        const serverStaus = await getServerStatus();
        const login = await AsyncStorage.getItem("Authorized");

        if (!login) {
            Alert.alert("Error", "User not authorized");
            return;
        }

        if (serverStaus && isConnected) {
            if (!date || !longitude || !latitude) {
                const location = await getLocation();
                date = new Date().toISOString()
                longitude = location.longitude
                latitude = location.latitude
            }
            let url = null;
            const formDataCloud = new FormData();
            formDataCloud.append('file', { uri: uri, name: `photo${login}.jpg`, type: 'image/jpg' });
            formDataCloud.append('upload_preset', 'Testing');
            formDataCloud.append('cloud_name', 'dzs2ayj8k');

            try {
                const response = await fetch('https://api.cloudinary.com/v1_1/dzs2ayj8k/image/upload', {
                    method: 'post',
                    body: formDataCloud
                });
                const data = await response.json();
                if (data.secure_url) {
                    url = data.secure_url;
                    console.log(data.secure_url);
                }
            } catch (error) {
                console.log(error);
            }
            if (!url) {
                Alert.alert("Error", "No URL generated from image upload");
                return;
            }
            const payload = {
                Url: url,
                Date: date,
                Login: login,
                Longitude: longitude.toString(),
                Latitude: latitude.toString(),
                Description: description,
                Situation: situation.toString() || ''
            };

            const response = await axios.post(`${API_URL}/photo/sendPhoto`, payload, {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 15000,
            });

            if (response.status === 200) {
                console.log("FetchSendPhoto => Code:", response.status);
                Alert.alert('Photo sent successfully!');
            } else {
                Alert.alert("Error", "Failed to send photo", [{ text: "OK" }]);
            }
        } else {
            const location = await getLocation();
            await insertPhoto(uri, new Date().toISOString(), location, situation, description);
            Alert.alert("No Internet", "Photo will be sent later", [{ text: "OK" }]);
        }
    } catch (error) {
        if (error.response) {
            console.error("Error in FetchSendPhoto:", error.response.data);
            Alert.alert("Error", `Server Error: ${error.response.data}`, [{ text: "OK" }]);
        } else if (error.request) {
            console.error("Error in FetchSendPhoto (No response):", error.request);
            Alert.alert("Error", "No response from server", [{ text: "OK" }]);
        } else {
            console.error("Error in FetchSendPhoto (Request setup):", error.message);
            Alert.alert("Error", "Request setup failed", [{ text: "OK" }]);
        }
    }
};

export const FetchGetDaysWithMarkersByMonth = async (login, month, year) => {
    try {
        const response = await axios.get(`${API_URL}/photo/getDaysWithMarkers`, {
            params: { month : month, year: year,login: login },
        });

        if (response.status === 200) {
            return response.data ;
        } else {
            Alert("Error", "No internet conection. Try Later")
            console.error("Error fetching days with markers:", response.status);
        }
    } catch (error) {
        console.error("Error in FetchGetDaysWithMarkers:", error.response ? error.response.data : error);
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
