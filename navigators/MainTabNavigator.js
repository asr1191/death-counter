import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View } from 'react-native'

import CounterScreen from '../screens/CounterScreen';
import DatabaseScreen from '../screens/DatabaseScreen';
import MyTabBar from '../components/MyTabBar';

const Tab = createMaterialTopTabNavigator();

export default function MainTabNavigator(props) {
    return (
        <Tab.Navigator
            // tabBar={props => <MyTabBar {...props} />}
            style={props.style}
            sceneContainerStyle={
                {
                    backgroundColor: 'rgba(214, 201, 180, 0.1)'
                }
            }
        >
            <Tab.Screen
                name="Deaths"
                component={CounterScreen}
            />
            <Tab.Screen name="Bosses" component={DatabaseScreen} />
        </Tab.Navigator>
    )
}