import { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppContext } from '../Provider/AppContextProvider';

export default MainScreen = ({ navigation }) => {
  const { theme } = useContext(AppContext);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      await createTable();
      setLoading(true);
      const status = await AsyncStorage.getItem('Authorized');
      if (status) {
        await CheakPhotosToSend()
      }
      setLoading(false);
    };

    init();
  }, []);

  const handleOpen = async (where) => {
    if (await AsyncStorage.getItem('Authorized')) {
      navigation.navigate(where);
    }
    else {
      Alert.alert('You are not authorized!');
    }
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.secondaryText }]}>Good day!</Text>
        <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>Choose an action:</Text>
        <TouchableOpacity style={styles.button} onPress={() => handleOpen('CameraScreen')}>
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>Take a photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleOpen('CalendarScreen')}>
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>Open calendar</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.secondaryText }]}>©Lev Kosyk</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: -40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    width: 80,
    height: 80,
    marginVertical: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});