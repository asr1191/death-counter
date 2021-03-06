/* eslint-disable import/namespace */
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { useMMKVNumber } from 'react-native-mmkv';

import { BOSSES_ID_KEY } from './CONSTANTS';
import IAPManagerWrapped from './components/IAPManager';
import BossContextProvider from './contexts/BossContext';
import MainTabNavigator from './navigators/MainTabNavigator';

export default function App() {
    SplashScreen.preventAutoHideAsync();
    const [loaded] = useFonts({
        RomanAntique: require('./assets/fonts/RomanAntique.ttf'),
        OptimusPrinceps: require('./assets/fonts/OptimusPrinceps.ttf'),
    });

    const [getNewId, setNewId] = useMMKVNumber(BOSSES_ID_KEY);

    useEffect(() => {
        NavigationBar.setVisibilityAsync('hidden');
        NavigationBar.setBehaviorAsync('overlay-swipe');
    }, []);

    useEffect(() => {
        if (getNewId === undefined) {
            setNewId(0);
        }
    }, [getNewId, setNewId]);

    if (loaded) {
        return (
            <NavigationContainer>
                <StatusBar translucent style="light" />
                <View style={styles.bgContainer}>
                    <ImageBackground
                        style={styles.ringImageBgComponent}
                        source={require('./assets/wallpaper-16x10.png')}
                        resizeMode="cover"
                        imageStyle={styles.ringImageBgStyle}
                        blurRadius={0}>
                        <IAPManagerWrapped>
                            <BossContextProvider>
                                <MainTabNavigator style={styles.tabNavigator} />
                            </BossContextProvider>
                        </IAPManagerWrapped>
                    </ImageBackground>
                </View>
            </NavigationContainer>
        );
    } else {
        return null;
    }
}

const styles = StyleSheet.create({
    bgContainer: {
        flex: 1,
        backgroundColor: '#030303',
    },
    tabNavigator: {
        borderRadius: 30,
        marginTop: Constants.statusBarHeight,
        margin: 20,
        backgroundColor: 'rgba(214, 201, 180, 0.1)',
    },
    ringImageBgComponent: {
        width: '100%',
        height: '100%',
    },
    ringImageBgStyle: {
        opacity: 1,
    },
});
