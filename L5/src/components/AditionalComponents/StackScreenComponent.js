import { createStackNavigator } from "@react-navigation/stack";

import DayDetailsScreen from '../Screens/DayDetailsScreen';
import CalendarScreen from '../Screens/CalendarScreen';
import MainScreen from '../Screens/MainScreen';
import CameraScreen from '../Screens/CameraScreen';


const Stack = createStackNavigator();

export default function StackScreenComponent() {
    return (
        <Stack.Navigator initialRouteName="MainScreen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainScreen" component={MainScreen} />
            <Stack.Screen name="CameraScreen" component={CameraScreen} />
            <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
            <Stack.Screen name="DayDetailsScreen" component={DayDetailsScreen} />
        </Stack.Navigator>
    );
}