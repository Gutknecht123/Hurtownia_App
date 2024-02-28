import { View, Text } from 'react-native'
import React from 'react'
import HomeScreen from '../screens/HomeScreen'
import LoginScreen from '../screens/LoginScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

export default function appNavigation() {
  return (
    <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
        <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
    </Stack.Navigator>
  )
}