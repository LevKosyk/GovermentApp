import React, { useState, createContext } from 'react';

import { CustomLightTheme, CustomDarkTheme } from '../Theme/Themes';

export const AppContext = createContext(null);

export default AppProvider = ({ children }) => {
    const [theme, setTheme] = useState(CustomLightTheme); 

    const changeTheme = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <AppContext.Provider value={{ theme, changeTheme }}>
            {children}
        </AppContext.Provider>
    );
};
