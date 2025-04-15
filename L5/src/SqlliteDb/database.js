import * as SQLite from "expo-sqlite";
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

export const openDatabase = async () => {
    const db = await SQLite.openDatabaseAsync('mydatabase.db');
    if (!db) {
        console.error("Error");
    }
    return db;
}

export const createTable = async () => {
    const database = await openDatabase();
    
    try {
        await database.execAsync(`
            PRAGMA journal_mode = WAL;

            create table if not exists photo(
                id integer primary key autoincrement,
                imageBase64 BLOB not null,
                date text not null,
                latitude text not null,
                longitude text not null,
                situation text not null,
                description text not null
            );
        `);
        console.log('Table created')
    } catch (error) {
        console.error("Error creating table:", error)
    }
}

export const insertPhoto = async (uri, date, location, situation, description) => {
    if (!uri || !date || !location || !situation || !description) {
        console.log('Error: Missing data');
        return;
    }

    try {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [],
            { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );
        const imageBuffer = await FileSystem.readAsStringAsync(result.uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const database = await openDatabase();

        const insertResult = await database.runAsync(
            'INSERT INTO photo (imageBase64, date, latitude, longitude, situation, description) VALUES (?, ?, ?, ?, ?, ?)',
            [imageBuffer, date, location.latitude, location.longitude, situation, description]
        );

        console.log('Photo inserted with id:', insertResult.lastInsertRowId);
    } catch (error) {
        console.error('Error inserting photo:', error);
    }
};


export const fetchPhoto = async () => {
    const database = await openDatabase();
    try {
        const allRows = await database.getAllAsync('select * from photo');
        return allRows;
    } catch (error) {
        console.error('Error fetching todos:', error)
    }
};

export const deletePhoto  = async (id) => {
    const database = await openDatabase();
    if (!id) {
        return;
    }
    try {
        const result = await database.runAsync('delete from photo where id = ?', id);
        console.log('Photo deleted:', result);
    } catch (error) {
        console.error('Error deleting todos: ', error)
    }
}

export const deleteAll  = async () => {
    const database = await openDatabase();
    if (!id) {
        return;
    }
    try {
        const result = await database.runAsync('delete from photo');
        console.log('Photo deleted:', result);
    } catch (error) {
        console.error('Error deleting todos: ', error)
    }
}

