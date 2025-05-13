import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useContext } from 'react';

import { AppContext } from '../Provider/AppContextProvider';

export default function Header({ month, year, clickUp, clickDown, now }) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthName = monthNames[month-1];

    const { theme } = useContext(AppContext);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.text, { color: theme.colors.secondaryText }]}>{monthName} {year}</Text>
            <View style={styles.box}>
                <TouchableOpacity style={[styles.button,  theme.cardCalendar ]} onPress={clickUp}>
                    <Text style={[styles.buttonText, { color: theme.colors.secondaryText }]}>↑</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,  theme.cardCalendar ]}onPress={clickDown}>
                    <Text style={[styles.buttonText, { color: theme.colors.secondaryText }]}>↓</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,  theme.cardCalendar ]}onPress={now}>
                    <Text style={[styles.buttonText, { color: theme.colors.secondaryText }]}>now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: 10,
    },
    box: {
        flexDirection: 'row',
        marginLeft: 10, 
    },
    button: {
        width: 40,
        height: 30,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 18,
        color: 'black',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
