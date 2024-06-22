import { Image, StyleSheet, View } from "react-native";
import Icon from './assets/KOVACS GROUP.png';
import LottieView from 'lottie-react-native';
import { Video } from 'expo-av';
export default function SplashScreen(){
    return(
        <View style={style.container}>
             
            {/* <LottieView source={ require('./assets/KOVACS GROUP Splash Screen.json')} 
            style={style.Image} autoPlay/> */}
            <Video
                source={require('./assets/KOVACS GROUP.mp4')} // Replace with your video file path
                style={style.Image}
                resizeMode="cover"
                isLooping
                shouldPlay
            />
       
        </View>
    )
}
const style = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'black',
    },
    Image:{
        width:350,
        position: 'absolute',
        height:350,
        resizeMode:"cover",
    },
});