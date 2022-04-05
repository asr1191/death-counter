import { createContext, useContext } from 'react';
import { View, StyleSheet, ImageBackground, Image, Dimensions, useWindowDimensions } from 'react-native'
import { NavigationContainer, DarkTheme } from '@react-navigation/native';

import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import MainTabNavigator from './navigators/MainTabNavigator'
import CurrentBossContext from './contexts/CurrentBossContext';

export default function App() {

    SplashScreen.preventAutoHideAsync();

    // let { height, width } = useWindowDimensions();

    // const isDBLoadingComplete = useDatabase();
    const isDBLoadingComplete = true
    const [loaded] = useFonts({
        RomanAntique: require('./assets/fonts/RomanAntique.ttf'),
        OptimusPrinceps: require('./assets/fonts/OptimusPrinceps.ttf')
    });

    if (loaded && isDBLoadingComplete) {

        return (
            <NavigationContainer>
                <StatusBar
                    translucent={true}
                    style={'light'}
                />
                <View style={{
                    flex: 1,
                    backgroundColor: '#030303',
                    // marginTop: Constants.statusBarHeight,

                }}>
                    <ImageBackground
                        style={styles.ringImageBgComponent}
                        source={require('./assets/background-responsive/wallpaper-16x10-2.png')}
                        resizeMode={'cover'}
                        imageStyle={[styles.ringImageBgStyle, {
                            // width: width,
                            // height: height
                        }]}
                        blurRadius={0}
                    >
                        <CurrentBossContext>
                            <MainTabNavigator style={{
                                borderRadius: 30,
                                marginTop: Constants.statusBarHeight,
                                margin: 20,
                                backgroundColor: 'rgba(214, 201, 180, 0.1)',
                            }} />
                        </CurrentBossContext>
                    </ImageBackground>
                </View>
            </NavigationContainer>
        );
    } else {
        return null
    }
}

const styles = StyleSheet.create({
    ringImageBgComponent: {
        width: '100%',
        height: '100%',
    },
    ringImageBgStyle: {
        opacity: 1
    }
})
