import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = ({ state, theme }) => {
    if (!state) return null; 
    return (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={[styles.loaderText, { color: theme?.colors?.text || '#000' }]}>
                Processing...
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    loaderText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
    },
});

export default Loader;