import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import MainScreen from '../screens/MainScreen';


const Stack = createStackNavigator();

export default function MainStackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                // headerShadowVisible: false,
                headerTitleAlign: 'center',
                headerStyle: {
                    elevation: 1,
                    borderBottomWidth: 1
                }
            }}
        >
            <Stack.Screen name="DEATH COUNTER" component={MainScreen} />
        </Stack.Navigator>
    )
}