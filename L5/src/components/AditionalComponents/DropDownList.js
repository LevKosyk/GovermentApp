import React from 'react';
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const DropDownList = ({
    open,
    value,
    items,
    setOpen,
    setValue,
    setItems,
    onChangeValue,
    placeholder = "Select an option",
    theme,
    width,
    margin
}) => {

    return (
        <View style={styles.container}>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder={placeholder}
                onChangeValue={onChangeValue}
                style={[
                    styles.dropdown,
                    {
                        backgroundColor: theme?.colors?.surface || '#fff',
                        borderColor: theme?.colors?.secondaryText || '#ccc',
                        width: width,
                        marginLeft: margin
                    },
                ]}
                textStyle={{ color: theme?.colors?.secondaryText || '#000' }}
                dropDownContainerStyle={{
                    backgroundColor: theme?.colors?.surface || '#fff',
                    borderColor: theme?.colors?.secondaryText || '#ccc',
                }}
                placeholderStyle={{ color: theme?.colors?.secondaryText || '#aaa' }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 10,
        marginLeft: -100
    },
});

export default DropDownList;