import StackScreen from "./src/components/AditionalyScreens/StackScreens"
import AppProvider from './src/components/Provider/AppContextProvider'

export default App = () => {
    return(
        <AppProvider>
            <StackScreen />
        </AppProvider>
    )
}

