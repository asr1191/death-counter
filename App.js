import { View, StyleSheet, ImageBackground, Image, Dimensions, useWindowDimensions } from 'react-native'
import { NavigationContainer, DarkTheme } from '@react-navigation/native';

import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

import MainTabNavigator from './navigators/MainTabNavigator'

export default function App() {

    let { height, width } = useWindowDimensions();

    const [loaded] = useFonts({
        RomanAntique: require('./assets/fonts/RomanAntique.ttf'),
        OptimusPrinceps: require('./assets/fonts/OptimusPrinceps.ttf')
    });

    if (!loaded) {
        return <AppLoading />
    }

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
                    <MainTabNavigator style={{
                        borderRadius: 30,
                        margin: 20,
                        marginTop: Constants.statusBarHeight + 15,
                        backgroundColor: 'rgba(214, 201, 180, 0.1)',
                    }} />
                </ImageBackground>
            </View>
        </NavigationContainer>
    );
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
