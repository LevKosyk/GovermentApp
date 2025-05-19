import { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image, Pressable } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from 'react-native-maps';

import { AppContext } from '../Provider/AppContextProvider';
import { FetchDataByDay, FetchDataByDayForCrime } from '../../service/AppService';
import { Modal } from 'react-native-paper';
import Loader from '../AditionalComponents/Loader';
import DropDownList from '../AditionalComponents/DropDownList';
import { ViolationTypes } from '../../enums/enums';

export default function DayDetailsScreen({ route, navigation }) {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [description, setDescription] = useState(null);
    const [crimes, setCrimes] = useState([])
    const [sortOpen, setSortOpen] = useState(false);
    const [sortValue, setSortValue] = useState(null);
    const [sortItems, setSortItems] = useState([
        { label: 'By date ↑', value: 'dateAsc' },
        { label: 'By date ↓', value: 'dateDesc' },
    ]);

    const { theme } = useContext(AppContext);
    const { data } = route.params;

    useEffect(() => {
        const loadTasks = async () => {
            setLoading(true);
            const login = await AsyncStorage.getItem('Authorized');
            if (login) {
                const tasks = await FetchDataByDay(data, login);
                const crimeData = await FetchDataByDayForCrime(data, login)
                const updatedCrimeData = crimeData.map(task => ({
                    ...task,
                    situation: ViolationTypes[task.situation] || task.situation,
                }));
                const updatedTasks = tasks.map(task => ({
                    ...task,
                    situation: ViolationTypes[task.situation] || task.situation,
                }));
                setCrimes(updatedCrimeData)
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
        console.log(uri);
        setSelectedImage(uri);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedImage(null);
    };

    const handleOpenDescription = useCallback((description) => {
        setSortOpen(false);
        setDescription(description);
        setModalVisible(true);
    }, []);

    const handleSort = useCallback((value) => {
        if (!value) return;

        const sorted = [...todos].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return value === 'dateAsc' ? dateA - dateB : dateB - dateA;
        });

        setTodos(sorted);
    }, [todos]);

    const loadData = (data) => {
        return (
            <View style={[styles.listContainer]}>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={[styles.listItem, { backgroundColor: theme.colors.surface }]}>
                            <TouchableOpacity onPress={() => handleOpenImage(item.url)} style={styles.photoItem}>
                                <Image
                                    source={{ uri: item.url }}
                                    style={styles.image}
                                />
                            </TouchableOpacity>
                            <View style={[styles.listItemContent, { backgroundColor: theme.colors.surface }]}>
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
        )
    }

    const renderSection = (data, title, iconName, iconColor) => (
        <>
            <View style={[styles.sectionHeader, { backgroundColor: theme.colors.surface, }]}>
                <Ionicons name={iconName} size={22} color={iconColor} style={{ marginRight: 8 }} />
                <Text style={[styles.sectionHeaderText, { color: theme.colors.secondaryText }]}>{title}</Text>
            </View>
            {data && data.length > 0 ? (
                loadData(data)
            ) : (
                <Text style={[styles.emptyMessage, { color: theme.colors.secondaryText, marginBottom: todos.length === 0? 50 : 0}]}>Nothing for this section</Text>
            )}
        </>
    );


    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>

            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: '#007bff', marginTop: 20 }]}
                    onPress={() => navigation.goBack("CalendarScreen")}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>

                <Text style={[styles.header, { color: theme.colors.secondaryText }]}>Data for {data}</Text>

                <Loader state={loading} theme={theme} />

                {!loading && (
                    todos.length === 0 && crimes.length === 0 ? (
                        <Text style={[styles.emptyMessage, { color: theme.colors.secondaryText }]}>Nothing for this day</Text>
                    ) : (
                        <View style={styles.contentContainer}>
                            <View style={styles.mapContainer}>
                                <MapView
                                    style={styles.map}
                                    initialRegion={mapRegion}
                                >
                                    {crimes.map(item => (
                                        <Marker
                                            key={item.id}
                                            coordinate={{
                                                latitude: parseFloat(item.latitude),
                                                longitude: parseFloat(item.longitude),
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
                                    {todos.map(item => (
                                        <Marker
                                            key={item.id}
                                            coordinate={{
                                                latitude: parseFloat(item.latitude),
                                                longitude: parseFloat(item.longitude),
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

                            <View style={{ marginBottom: 15, alignItems: 'flex-end', flexDirection: 'row', zIndex: modalVisible || isModalVisible ? 0 : 1000 }}>
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
                                    margin="45%"
                                />
                            </View>

                            {renderSection(crimes, "Crimes", "alert-circle", "#d9534f")}
                            {renderSection(todos, "I fixed", "checkmark-circle", "#28a745")}


                        </View>
                    )
                )}

                <Modal visible={isModalVisible} transparent animationType="fade" onRequestClose={handleCloseModal} >
                    <View style={[styles.modalOverlay, {backgroundColor: theme.colors.background}]}>
                        <View style={[styles.enhancedModalView, {backgroundColor: theme.colors.background}]}>
                            <TouchableOpacity onPress={handleCloseModal} style={[styles.enhancedCloseButton, {backgroundColor: theme.colors.background}]} activeOpacity={0.7}> 
                                <Ionicons name="close" size={28} color={theme.colors.secondaryText} />
                            </TouchableOpacity>
                            <Image source={{ uri: selectedImage }} style={styles.enhancedModalImage}/>
                        </View>
                    </View>
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
                                <Text style={styles.textStyle}>Hide</Text>
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
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 5,
    },
    sectionHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    markerContainer: {
        backgroundColor: 'white',
        padding: 2,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ccc',
        position: 'relative',
    },
    markerImage: {
        width: 50,
        height: 50,
        borderRadius: 6,
    },
    enhancedModalView: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: 320,
        height: 420,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
        position: 'relative',
    },
    enhancedModalImage: {
        width: 280,
        height: 350,
        borderRadius: 14,
        marginTop: 30,
        backgroundColor: '#eee',
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    enhancedCloseButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 4,
    },
});
