import { useContext } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';

import { AppContext } from '../Provider/AppContextProvider';

export default function DayComponentScreen({ day, isTask, navigation, date, textStyle }) {
  const { theme } = useContext(AppContext);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      onPress={() => navigation.navigate('DayDetailsScreen', { data: date })}
    >
      {isTask && <Text style={[styles.dot]}>{'•'}</Text>}
      <Text style={[styles.text, { color: theme.colors.secondaryText }, textStyle]}>{day}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',  
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  dot: {
    fontSize: 18,
    color: '#f44336',
    position: 'absolute', 
    top: -5, 
  },
});
