import React, { useState, useContext, useEffect, useMemo } from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image, Alert, Pressable } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from '../Provider/AppContextProvider';
import { FetchDataByDay } from '../../service/AppService';
import MapView, { Marker } from 'react-native-maps';
import Navbar from '../AditionalyScreens/Navbar';
import { Modal } from 'react-native-paper';
import { CustomDarkTheme } from '../Theme/Themes';
import Loader from '../AditionalComponents/Loader'; // Import Loader component
import DropDownList from '../AditionalComponents/DropDownList'; // Import DropDownList component
import { ViolationTypes } from '../../enums/enums';

export default function DayDetailsScreen({ route, navigation }) {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [description, setDescription] = useState(null);
    const { theme } = useContext(AppContext);
    const { data } = route.params;

    const [sortOpen, setSortOpen] = useState(false);
    const [sortValue, setSortValue] = useState(null);
    const [sortItems, setSortItems] = useState([
        { label: 'By date ↑', value: 'dateAsc' },
        { label: 'By date ↓', value: 'dateDesc' },
    ]);

    useEffect(() => {
        const loadTasks = async () => {
            setLoading(true);
            const login = await AsyncStorage.getItem('Authorized');
            if (login) {
                const tasks = await FetchDataByDay(data, login);
                const updatedTasks = tasks.map(task => ({
                    ...task,
                    situation: ViolationTypes[task.situation] || task.situation,
                }));
                setTodos(updatedTasks);
            }
            setLoading(false);
        };
        loadTasks();
    }, [data]);

    const mapRegion = useMemo(() => {
        const latitudes = todos.map(item => parseFloat(item.latitude));
        const longitudes = todos.map(item => parseFloat(item.longitude));
        return {
            latitude: (Math.max(...latitudes) + Math.min(...latitudes)) / 2,
            longitude: (Math.max(...longitudes) + Math.min(...longitudes)) / 2,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };
    }, [todos]);

    const handleOpenImage = (uri) => {
        setSelectedImage(uri);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedImage(null);
    };

    const handleOpenDescription = (description) => {
        setSortOpen(false);
        setDescription(description);
        setModalVisible(true);
    };

    const handleSort = (value) => {
        if (!value) return;

        const sorted = [...todos].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);

            if (value === 'dateAsc') {
                return dateA - dateB;
            } else if (value === 'dateDesc') {
                return dateB - dateA;
            }

            return 0;
        });

        setTodos(sorted);
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Navbar navigation={navigation} />
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: '#007bff', marginTop: 20 }]}
                    onPress={() => navigation.goBack("CalendarScreen")}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>

                <Text style={[styles.header, { color: theme.colors.secondaryText }]}>Tasks for {data}</Text>

                <Loader state={loading} theme={theme} /> 

                {!loading && (
                    todos.length === 0 ? (
                        <Text style={[styles.emptyMessage, { color: theme.colors.secondaryText }]}>Nothing for this day</Text>
                    ) : (
                        <View style={styles.contentContainer}>
                            <View style={styles.mapContainer}>
                                <MapView
                                    style={styles.map}
                                    initialRegion={mapRegion}
                                >
                                    {todos.map(item => (
                                        <Marker
                                            key={item.id}
                                            coordinate={{
                                                latitude: parseFloat(item.latitude),
                                                longitude: parseFloat(item.longetude),
                                            }}
                                        >
                                            <View style={styles.markerContainer}>
                                                <Image
                                                    source={{ uri: item.url }}
                                                    style={styles.markerImage}
                                                />
                                            </View>
                                        </Marker>
                                    ))}
                                </MapView>
                            </View>

                            <View style={{ marginBottom: 15, alignItems: 'flex-end', flexDirection: 'row', zIndex: modalVisible ? 0 : 1000 }}>
                                <Text style={[styles.textStyle, { color: theme.colors.secondaryText, fontWeight: '800', fontSize: 26 }]}>Crimes:</Text>
                                <DropDownList
                                    open={sortOpen}
                                    value={sortValue}
                                    items={sortItems}
                                    setOpen={setSortOpen}
                                    setValue={setSortValue}
                                    setItems={setSortItems}
                                    onChangeValue={handleSort}
                                    placeholder="Sort by"
                                    theme={theme}
                                    width="40%"
                                    margin ="45%"
                                />
                            </View>

                            <View style={styles.listContainer}>
                                <FlatList
                                    data={todos}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <View style={styles.listItem}>
                                            <TouchableOpacity onPress={() => handleOpenImage(item.url)} style={styles.photoItem}>
                                                <Image
                                                    source={{ uri: item.url }}
                                                    style={styles.image}
                                                />
                                            </TouchableOpacity>
                                            <View style={styles.listItemContent}>
                                                <Text style={[styles.timeText, { color: theme.colors.secondaryText }]}>
                                                    {item.date.split('T')[1].split(':').slice(0, 2).join(':')}
                                                </Text>
                                                <Text style={[styles.situation, { color: theme.colors.secondaryText }]}>
                                                    {item.situation}
                                                </Text>
                                                <TouchableOpacity onPress={() => handleOpenDescription(item.description)}>
                                                    <Text style={[styles.description, { color: 'blue' }]}>
                                                        Read description
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
                    )
                )}

                <Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={handleCloseModal}>
                    <TouchableOpacity style={styles.fullscreenContainer} onPress={handleCloseModal}>
                        <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} resizeMode="contain" />
                    </TouchableOpacity>
                </Modal>

                <Modal
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(!modalVisible)}
                    contentContainerStyle={{ zIndex: 2000, elevation: 20 }}
                >
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView, { backgroundColor: theme.colors.surface }]}>
                            <Text style={[styles.modalText, { color: theme.colors.secondaryText }]}>{description || "No description available"}</Text>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>Hide Modal</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    header: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    listItemContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 15,
    },
    contentContainer: {
        flex: 1,
    },
    mapContainer: {
        flex: 1,
        marginBottom: 20,
        borderRadius: 8,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    markerImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
    listContainer: {
        flex: 1,
        paddingBottom: 20,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
    },
    backButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        padding: 10,
        borderRadius: 8,
    },
    emptyMessage: {
        fontSize: 18,
        fontWeight: '300',
        textAlign: 'center',
        marginTop: 30,
    },
    timeText: {
        fontSize: 17,
        fontWeight: '500',
        marginBottom: 5,
        opacity: 0.7,
    },
    description: {
        fontSize: 17,
        color: '#444',
        marginBottom: 5,
        lineHeight: 20,
    },
    situation: {
        fontSize: 17,
        fontWeight: '600',
        color: '#007bff',
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
    centeredView: {
        alignItems: 'center',
        zIndex: 10000
    },
    modalView: {
        backgroundColor: 'white',
        padding: 35,
        borderRadius: 10,
        elevation: 5,
        width: 300,
        maxHeight: 'auto',
        zIndex: 1000, 
    },
    modalText: {
        marginBottom: 15,
        fontSize: 18,
        color: 'black',
    },
    button: {
        padding: 10,
        elevation: 2,
        width: '100%',
        borderRadius: 5,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    fullscreenContainer: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
