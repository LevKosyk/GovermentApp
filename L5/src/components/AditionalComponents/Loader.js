import { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import {AppContext} from '../Provider/AppContextProvider'

export default Loader = ({ state }) => {
    const {theme} = useContext(AppContext)
    if (!state) return null; 
    return (
        <View style={[styles.loaderContainer, {backgroundColor: theme.colors.background}]}>
            <ActivityIndicator size="large" color="#007bff" />
        </View>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        width: '100%',
        height: '100%'
    },
});
