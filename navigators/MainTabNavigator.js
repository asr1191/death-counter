import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Dimensions } from 'react-native'

import CounterScreen from '../screens/CounterScreen';
import DatabaseScreen from '../screens/DatabaseScreen';


const Tab = createMaterialTopTabNavigator();

export default function MainTabNavigator(props) {
    return (
        <Tab.Navigator
            // tabBar={props => <MyTabBar {...props} />}
            initialLayout={{ width: Dimensions.get('window').width }}
            style={props.style}
            sceneContainerStyle={
                {
                    backgroundColor: 'transparent',
                    overflow: 'hidden',
                }
            }
            screenOptions={{
                // tabBarBounces: false,
                tabBarStyle: {
                    backgroundColor: '#453d30',
                    marginTop: 50,
                    width: '80%',
                    left: '10%',
                    bottom: '2%',
                    borderRadius: 30
                },
                tabBarItemStyle: {
                    backgroundColor: 'transparent',
                },
                tabBarLabelStyle: {
                    fontFamily: 'RomanAntique',
                    fontSize: 15,

                },
                tabBarActiveTintColor: '#F3D39E',
                tabBarIndicatorContainerStyle: {
                    width: '60%',
                    alignSelf: 'center',
                    left: '10%',
                    bottom: '25%'
                },
                tabBarIndicatorStyle: {
                    backgroundColor: '#F3D39E',
                    // width: '100%',
                    // opacity: 0.2,
                    // height: '100%',
                    borderRadius: 30

                    // left: 43,
                    // bottom: 10
                },
                tabBarPressColor: 'transparent'
            }}
        >
            <Tab.Screen
                name="D E A T H S"
                component={CounterScreen}
            />
            <Tab.Screen
                name="B O S S E S"
                component={DatabaseScreen}
            />
        </Tab.Navigator>
    )
}