import React from 'react';
import {View, StyleSheet} from 'react-native'
import LottieView from 'lottie-react-native';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
const scaleFactor = Math.min(width / 320, height / 640); // Adjust 320 according to your base width

const AppLoader = () =>{
    return(
        <View style = {[StyleSheet.absoluteFillObject, style.container]}>
            <LottieView source={ require('./assets/loading.json')} style={[{flex:1},
            {width:170* scaleFactor *0.6},{height:170* scaleFactor *0.6},{justifySelf:'center'},{alignSelf:'center'}]} autoPlay loop/>
        </View>
    );
}
const style = StyleSheet.create({
    container :{
        justifyContent: 'center',
        alignContent:'center',
        marginTop:40,
       backgroundColor:'rgba(0,0,0,0.3)',
        zIndex:1,
    },

})

export default AppLoader;