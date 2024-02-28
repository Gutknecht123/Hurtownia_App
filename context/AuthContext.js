import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, {createContext, useState, useEffect} from "react";
import { BASE_URL } from "../config";
import { Alert } from 'react-native'

export const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
    const [isLoading, setIsLoading] = useState(false)
    const [userToken, setUserToken] = useState(null)
    const [userInfo, setUserInfo] = useState(null)

    const login = (email, password) => {
        setIsLoading(true)

        const headers = {
            'Content-Type': 'multipart/form-data'
          }

        axios.post(`${BASE_URL}/wp-json/custom/v1/login`, {
            email,
            password
        },
        {
            headers: headers
        })
        .then((res) => {
            let userInfo = res.data
            setUserInfo(userInfo)
            setUserToken(userInfo.token)
            AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
            AsyncStorage.setItem('userToken', userInfo.token)
            console.log(userInfo)
        })
        .catch((err) => {
            console.log(err)
        })

        setIsLoading(false)
    }

    const sendProducts = async(p, d) => {
        const headers = {
            'Content-Type': 'multipart/form-data'
          }

        const products = p
        const dane = d
        await axios.post(`${BASE_URL}/wp-json/custom/v1/create-document`, {
            'products': products,
            'dane': dane
        },
        {
            headers: headers
        })
        .then((res) => {
            Alert.alert('Pomyślnie utworzono WZ', 'Nazwa utworzonego pliku: ' + res.data.file + '.pdf')
            console.log(res.data)
        })
        .catch((err) => {
            Alert.alert('', 'Wystąpił nieoczekiwany błąd podczas tworzenia WZ!')
            console.log(err.response.data)
        })
    }

    const logout = () => {
        setIsLoading(true)
        setUserToken(null)
        AsyncStorage.removeItem('userToken')
        AsyncStorage.removeItem('userInfo')
        setIsLoading(false)

    }

    const getProducts = async() => {
        try{
            const response = await axios.get(`${BASE_URL}/wp-json/custom/v1/products`)
            //console.log(response.data[0])
            return response.data
        }catch(err){
            console.error('Error', err)
        }
    }

    const isLoggedIn = async() => {

        try{
            setIsLoading(true)
            let userInfo = await AsyncStorage.getItem('userInfo')
            let userToken = await AsyncStorage.getItem('userToken')
            userInfo = JSON.parse(userInfo)

            if(userInfo){
                setUserToken(userToken)
                setUserInfo(userInfo)
            }
            setIsLoading(false)
        }catch(err){
            console.log(err)
        }
    }
    const test = () => {
        console.log('test')
    }

    useEffect(() => {
        isLoggedIn()
    }, [])

    return (
        <AuthContext.Provider value={{test, login, sendProducts, getProducts, logout, isLoading, userToken, userInfo}}>
            {children}
        </AuthContext.Provider>
    )
}