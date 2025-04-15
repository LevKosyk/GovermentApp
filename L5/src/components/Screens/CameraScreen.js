import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FetchSendPhoto } from '../../service/AppService';
import { AppContext } from '../Provider/AppContextProvider';
import { TextArea } from 'react-native-ui-lib';
import { ViolationTypes } from '../../enums/enums';
import Navbar from '../AditionalyScreens/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DropDownList from '../AditionalComponents/DropDownList'
import { Modal } from 'react-native';
import Loader from '../AditionalComponents/Loader'

const CameraScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [situation, setSituation] = useState(null);
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { theme } = useContext(AppContext);

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required');
        return;
      }
    };

    getPermissions();

    const itemsPicker = Object.keys(ViolationTypes).map(key => ({
      label: ViolationTypes[key],
      value: key,
    }));
    setItems(itemsPicker);
  }, []);

  const handleOpenCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 1, cameraType: 'back' });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const sendPhoto = async () => {
    setLoading(true);
    try {
      await FetchSendPhoto(photo, null, situation, null, null, description);
    } catch (error) {
      console.error('Error sending photo:', error);
      Alert.alert('Failed to send photo.');
    } finally {
      setLoading(false);
      navigation.navigate('MainScreen');
    }
  };

  const handleOpenImage = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Navbar navigation={navigation} disabled={loading} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
        >
          <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>

            <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={handleCloseModal}>
              <TouchableOpacity style={styles.fullscreenContainer} onPress={handleCloseModal}>
                <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} resizeMode="contain" />
              </TouchableOpacity>
            </Modal>
            <Loader state={loading} />
            {loading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={[styles.loaderText, { color: theme.colors.text }]}>Processing...</Text>
              </View>
            ) : (
              <>

                {photo ? (
                  <TouchableOpacity style={styles.preview} onPress={() => handleOpenImage(photo)}>
                    <Image source={{ uri: photo }} style={styles.preview} />
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.imagePreviewContainer, { borderColor: theme.colors.secondaryText }]}>
                    <Ionicons name="camera" size={100} color="#ccc" />
                  </View>
                )}

                <TouchableOpacity onPress={handleOpenCamera} style={styles.cameraButton}>
                  <Text style={[styles.buttonText, { color: theme.colors.text }]}>Take a Photo</Text>
                </TouchableOpacity>

                <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Situation</Text>
                <DropDownList
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  theme={theme}
                  onChangeValue={setSituation}
                  width="100%"
                  margin="0%"
                />

                <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Description</Text>
                <View style={[styles.TextAreaContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.secondaryText }]}>
                  <TextArea
                    style={[styles.textArea, { backgroundColor: theme.colors.surface, color: theme.colors.secondaryText }]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe the situation..."
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
                  onPress={sendPhoto}
                  disabled={!photo || !situation || !description}
                >
                  <Text style={[styles.buttonText, { color: theme.colors.text }]}>Send Photo</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );

};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  dropdown: {
    borderRadius: 8,
    borderWidth: 1,
    height: 50,
  },
  imagePreviewContainer: {
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    width: '100%',
    height: 270,
    justifyContent: 'center',
    alignItems: 'center',
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
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  preview: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  cameraButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 15,
    alignSelf: 'flex-start',
    color: '#333',
  },
  sendButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  textArea: {
    width: '100%',
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  TextAreaContainer: {
    width: '100%',
    height: 150,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraScreen;
