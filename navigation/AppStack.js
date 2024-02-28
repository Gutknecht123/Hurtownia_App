import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainScreen from '../screens/MainScreen'
import CustomDrawer from '../components/CustomDrawer'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Drawer = createDrawerNavigator()
const Stack = createNativeStackNavigator()

export default function AppStack() {

  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawer {...props}/>} screenOptions={{headerShown: false, unmountOnBlur: true,
    drawerActiveTintColor: 'white',
    drawerActiveBackgroundColor: '#79AC78',
    drawerLabelStyle: {marginLeft: -25, fontSize: 15}}} initialRouteName='Main'>
            <Drawer.Screen name="Strona główna" component={MainScreen} options={{
              drawerIcon: ({color}) => (
                  <Ionicons name="home-outline" size={(25)} color={color} />
              ), headerShown: false
            }} />
    </Drawer.Navigator>
  )
}