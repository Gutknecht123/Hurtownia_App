import { View, Text } from 'react-native'
import React, {useContext} from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { AuthContext } from '../context/AuthContext'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function CustomDrawer(props) {
    //const {userInfo} = useContext(AuthContext)
    const {logout} = useContext(AuthContext)
  return (
    <View className="flex-1">
        <DrawerContentScrollView {...props} contentContainerStyle={{}}>
            <View className="flex-1 bg-white pt-5">
                <DrawerItemList {...props}/>
            </View>
        </DrawerContentScrollView>
        <View style={{padding: 20, borderTopWidth:1, borderTopColor: '#ccc', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => {logout()}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons name="exit-outline" size={25} />
                    <Text style={{fontSize: 15, }}> Wyloguj</Text>
                </View>
            </TouchableOpacity>
        </View>
    </View>
  )
}