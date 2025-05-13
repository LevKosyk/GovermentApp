import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppContext } from '../Provider/AppContextProvider';
import DayComponentScreen from './DayComponentsScreen';
import Header from '../AditionalyScreens/Header';
import { FetchGetDaysWithMarkersByMonth } from '../../service/AppService';

export default function CalendarScreen({ navigation }) {
    const { theme } = useContext(AppContext);

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [matrix, setMatrix] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        createTable();
    }, [currentYear, currentMonth]);


    const handleNow = () => {
        setCurrentYear(new Date().getFullYear());
        setCurrentMonth(new Date().getMonth());
    };

    const clickUp = () => {
        setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1);
        if (currentMonth === 0) setCurrentYear(currentYear - 1);
    };

    const clickDown = () => {
        setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1);
        if (currentMonth === 11) setCurrentYear(currentYear + 1);
    };

    async function createTable() {
        setLoading(true);
        try {
            const days = [];
            const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const daysInPreviousMonth = new Date(currentYear, currentMonth, 0).getDate();
            const loginForUser = await AsyncStorage.getItem('Authorized');

            if (!loginForUser) {
                console.error('User not authorized');
                return;
            }

            const tasksForUser = await FetchGetDaysWithMarkersByMonth(loginForUser, currentMonth + 1, currentYear)

            generateDays(days, daysInPreviousMonth - firstDay + 1, daysInPreviousMonth, currentMonth === 0 ? 11 : currentMonth - 1, currentMonth === 0 ? currentYear - 1 : currentYear, tasksForUser, styles.notNowMonthDay);
            generateDays(days, 1, daysInMonth, currentMonth, currentYear, tasksForUser, null, true);
            generateDays(days, 1, 54 - days.length, currentMonth === 11 ? 0 : currentMonth + 1, currentMonth === 11 ? currentYear + 1 : currentYear, tasksForUser, styles.notNowMonthDay);

            setMatrix(days);
        } catch (error) {
            console.error('Error in createTable:', error);
        } finally {
            setLoading(false); 
        }
    }

    const generateDays = (days, start, end, month, year, tasksForUser, textStyle, isCurrentMonth = false) => {
        for (let i = start; i <= end; i++) {
            const day = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const tasksForDay = tasksForUser.filter(task => task?.split('T')[0] === day);

            days.push(
                <DayComponentScreen
                    key={`${isCurrentMonth ? 'current' : 'other'}${i}`}
                    day={i}
                    textStyle={isCurrentMonth && i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? { color: 'red' } : textStyle}
                    isTask={tasksForDay.length > 0}
                    date={day}
                    navigation={navigation}
                />
            );
        }
    };

    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
           
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#007bff" />
                        <Text style={{ color: theme.colors.text, marginTop: 10 }}>Loading...</Text>
                    </View>
                ) : (
                    <>
                        <Header
                            month={currentMonth + 1}
                            year={currentYear}
                            clickUp={clickUp}
                            clickDown={clickDown}
                            now={handleNow}
                        />
                        <View style={styles.row}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                <View key={index} style={styles.dayText}>
                                    <Text style={[styles.dayTextText, { color: theme.colors.primary }]}>{day}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.board}>
                            {Array.from({ length: 6 }).map((_, rowIndex) => (
                                <View key={rowIndex} style={styles.row}>
                                    {Array.from({ length: 7 }).map((_, colIndex) => (
                                        <View key={colIndex} style={styles.cell}>
                                            {matrix[rowIndex * 7 + colIndex]}
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        zIndex: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 5,
    },
    board: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        marginTop: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    dayText: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayTextText: {
        fontSize: 14,
        fontWeight: '500',
    },
    notNowMonthDay: {
        color: '#aaa',
    },
});
