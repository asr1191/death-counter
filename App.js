import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet, ImageBackground, Image, Dimensions, useWindowDimensions } from 'react-native'
import Constants from 'expo-constants';

import MainTabNavigator from './navigators/MainTabNavigator'

export default function App() {

    let { height, width } = useWindowDimensions();

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
                    blurRadius={5}
                >
                    <MainTabNavigator style={{
                        borderRadius: 50,
                        margin: 20,
                        marginTop: Constants.statusBarHeight + 20,
                        marginBottom: 40,
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
        // top: '20%',
        // height: '50%',
        // width: '70%',
        // left: '15%',
        opacity: 1
    }
})
