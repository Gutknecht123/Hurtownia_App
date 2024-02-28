import { View, Text, KeyboardAvoidingView, Image, Modal, Button, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ScrollView } from 'react-native-gesture-handler'
import { AuthContext } from '../context/AuthContext'
import { TextInput } from 'react-native-gesture-handler'

export default function MainScreen({route, navigation}) {

  const {getProducts} = useContext(AuthContext)
  const [products, setProducts] = useState([])
  const [creating, setCreating] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [isSubmitVisible, setSubmitVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [wzProducts, setWzProducts] = useState([])
  const [submitData, setSubmitData] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])
  const {sendProducts} = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearchInputChange = (text) => {
    setSearchInput(text)
  }

  useEffect(() => {
    // Filter products based on the search input
    const filtered = products.filter((item) =>
      item.title.toLowerCase().includes(searchInput.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [searchInput, products])

  const fetchProducts = async () => {
      const prod = await getProducts()

      setProducts(prod)
  }
  const createWZ = async(odb, egz, nrmag, trans, zam, przez) => {

    if(wzProducts.length == 0){
      Alert.alert('', 'Nie wybrano produktów!')
      return
    }

    let slctd = []

    const p = {

      odbiorca: odb,
      egz: egz,
      nrmagazynowy: nrmag,
      transport: trans,
      zamowienie: zam,
      przeznaczenie: przez

    }

    slctd.push(p)

    setSubmitData(slctd)
    setSubmitVisible(false)
    setIsLoading(true)

    await sendProducts(wzProducts, slctd)

    setIsLoading(false)
    setSubmitData([])
    setCreating(false)
    setSelectedItem(null)
    setWzProducts([])
  }
  const toggleModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const toggleSubmit = () => {
    setSubmitVisible(true)
  }

  const closeSubmit = () => {
    setSubmitVisible(false);

  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };


  const CustomModal = ({ isVisible, closeModal, modalData }) =>{
    const [inputPrice, setInputPrice] = useState('')
    const [inputStock, setInputStock] = useState('')
    const handleInputPriceChange = (data) => {
      setInputPrice(data)
    }
    const handleInputStockChange = (data) => {
      setInputStock(data)
    }
    useEffect(() => {
      // Update input values only when modalData changes
      if (modalData !== null) {
        setInputPrice(modalData.product_data.price.toString());
        setInputStock("1");
      }

    }, [modalData]);
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeModal}
      >

        {modalData !== null && <View className="flex-1 justify-center items-center bg-opacity-50" style={{backgroundColor: "#79AC78"}}>
          <View className="bg-white p-4 rounded w-11/12">
              <View className="flex flex-row text-center items-center justify-center">
                  <View className="w-1/4 text-center">
                    <Image source={{ uri: modalData.image }} style={{height: 80, width: 80}}></Image>
                  </View>
                  <Text className="w-3/4 text-md text-center font-bold mb-2 mt-1">{modalData.title}</Text>
              </View>
              <View className="flex flex-row text-center items-center justify-center mt-5">
                <View className="w-1/2 justify-center items-center">
                  <Text className="text-lg font-bold mb-2 mt-1">Cena</Text>
                  <TextInput
                    keyboardType="numeric"
                    className="input mb-1 text-lg"
                    style={{textDecorationLine: "underline"}}
                    placeholder="0 zł"
                    value={inputPrice}
                    onChangeText={handleInputPriceChange}
                  />
                </View>
                <View className="w-1/2 justify-center items-center">
                  <Text className="text-lg font-bold mb-2 mt-1">Ilość ({modalData.product_data.stock_quantity.toString()})</Text>
                  <TextInput
                    keyboardType="numeric"
                    className="input mb-1 text-lg"
                    style={{textDecorationLine: "underline"}}
                    placeholder="0"
                    value={inputStock}
                    onChangeText={handleInputStockChange}
                  />
                </View>
              </View>
              <View className="flex flex-row text-center items-center justify-center mt-10">
                <TouchableOpacity className="w-1/2 h-10 justify-center text-center" style={{backgroundColor: "#1e73be", borderRadius: 7}} onPress={()=>handleSubmit(inputPrice, inputStock, modalData.id, modalData.product_data.stock_quantity)}>
                  <Text className="text-center color-white">Dodaj</Text>
                </TouchableOpacity>
              </View>
          </View>
        </View>}

      </Modal>
    )
  }
  const SendModal = ({ isVisible, closeModal }) =>{

    const [odbiorca, setOdbiorca] = useState('')
    const [egz, setEgz] = useState('')
    const [nrmag, setNrmag] = useState('')
    const [transport, setTransport] = useState('')
    const [zamowienie, setZamowienie] = useState('')
    const [przeznaczenie, setPrzeznaczenie] = useState('')
    //const [dataWysylki, setDataWysylki] = useState('')
    //const [nrDataFaktury, setNrDataFaktury] = useState('')


    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeModal}
      >

        <View className="flex-1 justify-center items-center bg-opacity-50" style={{backgroundColor: "#79AC78"}}>
          <View className="bg-white p-4 rounded w-11/12">
            <Text className="text-lg text-center font-bold mb-2 mt-1">Dodatkowe dane</Text>
            <ScrollView>
              <Text className="text-lg font-bold mb-2 mt-1">Odbiorca</Text>
              <TextInput
                className="input mb-5"
                placeholder="Wpisz odbiorce..."
                value={odbiorca}
                onChangeText={(text) => setOdbiorca(text)}
              />
              <Text className="text-lg font-bold mb-2 mt-1">Egz.</Text>
              <TextInput
                className="input mb-5"
                placeholder="Wpisz egz."
                value={egz}
                onChangeText={(text) => setEgz(text)}
              />
              <Text className="text-lg font-bold mb-2 mt-1">Nr. magazynowy</Text>
              <TextInput
                className="input mb-5"
                placeholder="Podaj Nr. magazynowy..."
                value={nrmag}
                onChangeText={(text) => setNrmag(text)}
              />
              <Text className="text-lg font-bold mb-2 mt-1">Transport</Text>
              <TextInput
                className="input mb-5"
                placeholder="Podaj transport..."
                value={transport}
                onChangeText={(text) => setTransport(text)}
              />
              <Text className="text-lg font-bold mb-2 mt-1">Zamówienie</Text>
              <TextInput
                className="input mb-5"
                placeholder="Wpisz zamówienie..."
                value={zamowienie}
                onChangeText={(text) => setZamowienie(text)}
              />
              <Text className="text-lg font-bold mb-2 mt-1">Przeznaczenie</Text>
              <TextInput
                className="input mb-5"
                placeholder="Podaj przeznaczenie..."
                value={przeznaczenie}
                onChangeText={(text) => setPrzeznaczenie(text)}
              />
              <View className="flex flex-row text-center items-center justify-center mt-6">
                <TouchableOpacity className="w-1/2 h-10 justify-center text-center" style={{backgroundColor: "#1e73be", borderRadius: 7}} onPress={()=>createWZ(odbiorca, egz, nrmag, transport, zamowienie, przeznaczenie)}>
                  <Text className="text-center color-white">Wyślij</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>

      </Modal>
    )
  }
  const handleSubmit = (price, il, id, allIl) => {
    // Implement your logic to handle the submitted data

    console.log(id)
    const priceRegex = /^(\d+(\.\d{1,2})?)$/;
    const quantityRegex = /^\d+$/;

    if(price <= 0 || !priceRegex.test(price.toString())){
      Alert.alert('', 'Podano błędną cenę!')
      return
    }
    if(il <=0 || !quantityRegex.test(il.toString())){
      Alert.alert('', 'Podano błędną ilość!')
      return
    }
    if(il > allIl){
      Alert.alert('', 'Podana ilość jest większa niż posiadana!')
      return
    }

    let slctd = wzProducts

    const p = {

      id: id,
      price: price,
      il: il,
      stock: allIl

    }

    slctd.push(p)

    setWzProducts(slctd)

    // You can close the modal after submitting if needed
    setModalVisible(false)
  }
  const clearData = () => {
    setCreating(false)
    setSelectedItem(null)
    setWzProducts([])
  }
  const deleteSelected = (id) => {

    const toDelete = wzProducts.filter(it => it.id !== id)

    setWzProducts(toDelete)

  }
  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <KeyboardAvoidingView className="flex-1" style={{backgroundColor: "#F0F0F0"}}>
      <SafeAreaView>
          <View className="flex-row items-center" style={{backgroundColor: "#79AC78", height: 50}}>
              <TouchableOpacity className="flex-row justify-center items-center" style={{backgroundColor: "#79AC78", height: 50, borderRadius: 40}}
                onPress={() => navigation.openDrawer()}>
                  <Ionicons name="reorder-three" size={(30)} color={'white'}/>
                  <Text className="text-white font-semibold text-lg">Menu</Text>
              </TouchableOpacity>
          </View>
      </SafeAreaView>
      {creating === false && <View className="flex flex-col justify-center items-center pt-5 pb-5">
        <View className="flex w-4/5 h-10" style={{backgroundColor: "#79AC78", borderRadius: 7}}>
          <TouchableOpacity onPress={() => setCreating(true)} className="h-full items-center justify-center" style={{borderRadius: 7}}>
              <Text style={{color: "white"}}>Stwórz WZ</Text>
          </TouchableOpacity>
        </View>

      </View>}
      {creating === true && <View className="flex flex-row justify-center items-center pt-5 pb-5 gap-1">
        <View className="flex w-2/5 h-10" style={{backgroundColor: "#79AC78", borderRadius: 7}}>
            <TouchableOpacity onPress={clearData} className="w-full h-full items-center justify-center" style={{borderRadius: 7}}>
                <Text style={{color: "white"}}>Anuluj</Text>
            </TouchableOpacity>
        </View>
        <View className="flex w-2/5 h-10" style={{backgroundColor: "#79AC78", borderRadius: 7}}>
            <TouchableOpacity onPress={()=>toggleSubmit()} className="w-full h-full items-center justify-center" style={{borderRadius: 7}}>
                <Text style={{color: "white"}}>Wyślij</Text>
            </TouchableOpacity>
        </View>
      </View>}
      <View className="flex text-center h-10 items-center justify-center mb-5">
        <TextInput
          style={{backgroundColor: "white", borderRadius: 7}}
          className="w-4/5 h-full text-center"
          placeholder="Wyszukaj produkt..."
          value={searchInput}
          onChangeText={handleSearchInputChange}
        />
      </View>
      <ScrollView className="flex-1">
        {filteredProducts.map((item, index)=>{
              const containsId = wzProducts.some(it => it.id === item?.id)
              return (
                <View className="flex flex-row justify-center items-center" key={index} style={
                  {alignSelf: "flex-end", backgroundColor: "white", maxWidth: "100%", borderRadius: 7, margin: 7, padding: 5}
                }>
                <View className="w-1/4 text-center">
                  <Image source={{ uri: item?.image }} style={{height: 80, width: 80}}></Image>
                </View>
                <Text className="w-1/2 text-center">{item?.title}</Text>
                <View className="w-1/4">
                  {creating === true && !containsId && <TouchableOpacity onPress={()=>toggleModal(item)}>
                    <Ionicons className="text-center" name="add-circle" size={(40)} color={'#79AC78'}/>
                  </TouchableOpacity>}
                  {creating === true && containsId && <TouchableOpacity onPress={()=>deleteSelected(item?.id)}>
                    <Ionicons className="text-center" name="close-circle" size={(40)} color={'red'}/>
                  </TouchableOpacity>}
                </View>
                  
                </View>
              )
          })}
      </ScrollView>
      <CustomModal isVisible={isModalVisible} closeModal={closeModal} modalData={selectedItem} />
      <SendModal isVisible={isSubmitVisible} closeModal={closeSubmit} />
      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
      >
        <View className="flex-1 justify-center items-center bg-opacity-50" style={{backgroundColor: "#79AC78"}}>
          <View>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Wysyłanie...</Text>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}