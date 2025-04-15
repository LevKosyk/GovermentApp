import { PaperProvider, DefaultTheme } from "react-native-paper";


export const CustomLightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "#ffffff", 
        text: "white",
        secondaryText: 'black',
        buttonColor: '#007bff',
        secondaryButtonClor: '#dc3545',
        surface: '#ffffff',
        picker: '#ffffff',
    },
    card: {
        backgroundColor: "#ffffff", 
        shadowColor: "rgba(0, 0, 0, 0.1)", 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardCalendar: {
        width: 40,
        height: 30,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0', 
        borderRadius: 8,
    },
    addButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#007bff', 
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
};

export const CustomDarkTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "#121212", 
        text: "#ffffff",
        secondaryText: '#b0b0b0',
        buttonColor: '#007bff',
        secondaryButtonColor: '#dc3545',
        surface: '#2E2E2EFF',
        picker: '#F3F0F0FF',
    },
    card: {
        backgroundColor: "#1e1e1e", 
        shadowColor: "rgba(0, 0, 0, 0.5)", 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardCalendar: {
        width: 40,
        height: 30,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333333', 
        borderRadius: 8,
    },
    addButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#007bff', 
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    }
};
