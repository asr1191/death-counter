import AsyncStorage from '@react-native-async-storage/async-storage';

const storeObjectAsync = async (key, value) => {
    try {
        const stringifiedObject = JSON.stringify(value)
        await AsyncStorage.setItem(key, stringifiedObject)
    } catch (e) {
        console.warn(e)
    }
}

const getObjectAsync = async (key) => {
    const value = await AsyncStorage.getItem(key)
    if (value != null) {
        const obj = JSON.parse(value)
        return obj;
    } else {
        return null;
    }
}

const storeDataAsync = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        console.warn(e)
    }
}
const getDataAsync = async (key) => {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
        return value;
    } else {
        return null;
    }
}

export const AsyncStorageHelper = {
    storeDataAsync,
    getDataAsync,
    storeObjectAsync,
    getObjectAsync,
}