import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  ScrollView, Image, Alert, Modal, TouchableOpacity,
  SafeAreaView, StatusBar, FlatList
} from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  onAuthStateChanged, initializeAuth, signOut, setPersistence, browserLocalPersistence,
  getReactNativePersistence
} from '@firebase/auth';
import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp, getDocs, collection, query, where } from 'firebase/firestore';
import { Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoader from './AppLoader';
import Icon from 'react-native-vector-icons/Ionicons';
import { CameraView, Camera } from "expo-camera";
import * as Font from 'expo-font';
const { width, height } = Dimensions.get('window');
import SplashScreen from './SplashScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const scaleFactor = Math.min(width / 320, height / 640); // Adjust 320 according to your base width
const loadFonts = async () => {
  await Font.loadAsync({
    'LibreBaskervillie': require('./assets/fonts/LibreBaskerville-Regular.ttf'),
    'Playwrite NL': require('./assets/fonts/Playwrite-NL.ttf'),
    'Dancing Script': require('./assets/fonts/DancingScript-Bold.ttf'),
  });
};
const firebaseConfig = {
  apiKey: "AIzaSyABEzmj4vORLaGVOBIDTHfwVjuDQLyjNh8",
  authDomain: "fir-4a763.firebaseapp.com",
  projectId: "fir-4a763",
  storageBucket: "fir-4a763.appspot.com",
  messagingSenderId: "1086567994893",
  appId: "1:1086567994893:web:34da273d04a93a1e6d6744",
  measurementId: "G-WLCW3R7631"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication, loading }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={styles.iconContainer}>
        <Image
          source={require('./assets/icon.png')}
          style={styles.icon}
        />
      </View>
      <Text style={styles.kovacsTittle}>KOVACS GROUP</Text>
      <View style={styles.authContainer}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#ffffff"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#ffffff"
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button style={styles.btnSignIn} title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color='#fff' />
        </View>
      </View>
      {loading && <AppLoader />}
    </View>
  );
};

const DashboardApp = ({ handleAuthentication }) => {


  useEffect(() => {
    loadFonts();
  }, []);
  const [activeSection, setActiveSection] = useState('Home');


  const renderSection = () => {
    switch (activeSection) {
      case 'Pickup':
        return <PickupSection />;
      case 'View-Pickup':
        return <ViewPickupSection />;
      case 'Register':
        return <RegisterSection />;
      case 'Calendar':
        return <CalendarSection />;
      default:
        return <HomeSection />;
    }
  };

  const renderBackButton = () => (
    <TouchableOpacity
      onPress={
        () =>
          setActiveSection('Home')
      } style={styles.backButton}>
      <Image
        source={require('./assets/arrow-ios-back.png')}
        style={{ width: 32, height: 32, marginEnd: 10 }}
      />

    </TouchableOpacity>
  );

  const HomeSection = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#b90000" />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          Kovacs Group
        </Text>
      </View>
      <View style={styles.featuresContainer}>
        <PressableFeatureBox name="Pickup"
          icon="bus-outline" onPress=
          {
            () => setActiveSection('Pickup')
          } />
        <PressableFeatureBox name="View Pickup"
          icon="eye-outline" onPress=
          {
            () => setActiveSection('View-Pickup')
          } />
        <PressableFeatureBox name="Register"
          icon="person-add-outline" onPress=
          {
            () => setActiveSection('Register')
          } />
        <PressableFeatureBox name="Extras"
          icon="people-outline" onPress=
          {
            () => setActiveSection('Calendar')
          } />
        <PressableFeatureBox name="Manage"
          icon="options-outline" onPress=
          {
            () => setActiveSection('Calendar')

          } />
        <PressableFeatureBox name="Reset"
          icon="refresh-outline" onPress=
          {
            () => setActiveSection('Calendar')
          } />
      </View>
      <Button title="Sign Out" onPress={handleAuthentication} color="#B90000" />
    </SafeAreaView>
  );

  const citySection = () => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#b90000" />
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>
       Choose your location
      </Text>
    </View>
    <View style={styles.featuresContainer}>
      <PressableFeatureBox name="Pickup"
        icon="bus-outline" onPress=
        {
          () => setActiveSection('Pickup')
        } />
      <PressableFeatureBox name="View Pickup"
        icon="eye-outline" onPress=
        {
          () => setActiveSection('View-Pickup')
        } />
     
    </View>
  
  </SafeAreaView>);

  const PressableFeatureBox = (
    { name, icon,
      onPress
    }
  ) => (
    <TouchableOpacity onPress={onPress}
      style={styles.featureBox}>
      <Icon name={icon} size={45}
        color="#b90000" />
      <Text style={styles.featureName}>
        {name}
      </Text>
    </TouchableOpacity>
  );

  const PickupSection = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Not yet Scanned');
    const [lastText, setLastText] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [empNotFound, setEmployeeNotFound] = useState(false);
    const scannedRef = useRef(false);
    const lastAlertTimeRef = useRef(0);
    const [lastAlertTime, setLastAlertTime] = useState(0);

    useEffect(() => {
      const getCameraPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      };

      if (hasPermission === null) {
        getCameraPermissions();
      }
    }, [hasPermission])

    const pushQR = async () => {
      try {
        // Fetch the employee document by ID
        const employeeDocRef = collection(db, 'Employees');
        const q = query(employeeDocRef, where("ID", "==", "" + text));
        const querySnapshot = await getDocs(q);
        let employeeName = "";

        // Check if any documents were found
        if (!querySnapshot.empty) {

          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            employeeName = doc.data().Name;
          });

          // Push entry into ScannedBarcodes collection
          await setDoc(doc(db, 'ScannedBarcodes', text), {
            ID: text,
            Name: employeeName,
            timestamp: serverTimestamp(),
          });
          console.log('Document successfully written!');
        } else {
          // Show modal or handle case where no employee is found
          console.error('No such document in Employees collection!');
          // Display modal or handle UI feedback
          // Example using a state to control modal visibility
          setModalVisible(true); // Define state and set it to true
          setEmployeeNotFound(true);
        }
      } catch (error) {
        console.error('Error writing document: ', error);
        // Handle error
        // Example: set an error state and display an error message
      }
    };

    // useEffect(() => {
    //   const checkScannedStatus = async () => {
    //     if (scannedRef.current && !alertVisible) {
    //       pushQR().then(() => {
    //         if (!empNotFound) {
    //           setAlertVisible(true);
    //           Alert.alert(
    //             `${text} - Scan Successful!`,
    //             'Keep Scanning..',
    //             [
    //               {
    //                 text: 'OK',
    //                 onPress: () => {
    //                   lastAlertTimeRef.current = Date.now();
    //                   setEmployeeNotFound(false);
    //                   scannedRef.current = false;
    //                   setAlertVisible(false);
    //                 },
    //               },
    //             ]
    //           );
    //         }
    //       });
    //     }
    //   }
    //   const interval = setInterval(checkScannedStatus, 1000); // Check every second

    //   return () => clearInterval(interval);
    // }, [text]);

    useEffect(() => {
      const interval = setInterval(() => {
        if (scannedRef.current && !alertVisible) {
          if (text != lastText) {
            pushQR().then(() => {
              if (!empNotFound) {
                setAlertVisible(true);
                setLastText(text);
                Alert.alert(
                  `${text} - Scan Successful!`,
                  'Keep Scanning..',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        lastAlertTimeRef.current = Date.now();
                        setEmployeeNotFound(false);
                        scannedRef.current = false;
                        setAlertVisible(false);
                      },
                    },
                  ]
                );
              }
            });
          } else if (text == lastText && Date.now() - lastAlertTimeRef.current > 2000) {
            if (!empNotFound) {
              setAlertVisible(true);
              Alert.alert(
                `${text} - Scan Successful!`,
                'ID already Scanned, Keep Scanning..',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      lastAlertTimeRef.current = Date.now();
                      setEmployeeNotFound(false);
                      scannedRef.current = false;
                      setAlertVisible(false);
                    },
                  },
                ]
              );
            }
          }
        }
      }, 1000);

      // Clear the interval when the component is unmounted
      return () => clearInterval(interval);
    }, []);



    // What happens when barcode is scanned
    const handleBarCodeScanned = ({ data }) => {
      // const now = Date.now();
      // const lastFiveDigits = now % 100000;
      // console.log('time:- ' + lastFiveDigits);

      setText(data);
      scannedRef.current = true;

    };

    const getOnBarcodeScannedHandler = () => {
      if (scannedRef.current) return undefined;
      return handleBarCodeScanned;
    };


    if (hasPermission === false) {
      return (
        <View style={styles.container}>
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>Please allow access to camera</Text>
            <Button title="Allow Camera" onPress={() => setHasPermission(null)} />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.cameraContainer}>
        {hasPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : (
          <>
            <StatusBar barStyle="dark-content" backgroundColor="black" />
            <View style={styles.header}>
              {renderBackButton()}
              <Text style={styles.headerText}>Pickup</Text>
            </View>
            <View style={styles.cameraFrame}>
              <CameraView

                onBarcodeScanned={getOnBarcodeScannedHandler()}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr", "pdf417"],
                }}
                style={{ width: 400 * scaleFactor * 0.8, height: 550 * scaleFactor * 0.8, }}
              />
              <LottieView
                source={require('./assets/scan_qr_animation.json')}
                style={styles.Scanner}
                autoPlay loop
              />


              <Text style={styles.scanHintText}>
                Cannot Scan QR Code? click here..
              </Text>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(false);
                }}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>No Employee Found!</Text>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.textStyle}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
          </>
        )}
      </View>
    );
  };

  const ViewPickupSection = () => {
    const [pickUpdata, setpickUpData] = useState([]);

    const fetchPickUPData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'ScannedBarcodes'));
        const fetchedData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setpickUpData(fetchedData);
      } catch (error) {
        console.error('Error fetching ScannedBarcodes documents: ', error);
      }
    };



    useEffect(() => {
      fetchPickUPData();
    }, []);


    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="black" />
          <View style={styles.header}>
            {renderBackButton()}
            <Text style={styles.headerText}>View Pickup</Text>
          </View>

          <ScrollView>
            {pickUpdata.map((item) => (
              <View key={item.id} style={styles.item}>
                <Text style={{ color: 'black', fontSize: 13, fontWeight: 'bold' }}>ID: {item.ID}</Text>
                <Text style={{ color: 'black', fontSize: 13, fontWeight: 'bold' }}>Name: {item.Name}</Text>
                <Text style={{ color: 'black', fontSize: 13, fontWeight: 'bold' }}>Time: {new Date(item.timestamp?.seconds * 1000).toLocaleString()}</Text>
              </View>
            ))}
          </ScrollView>

        </View>
      </SafeAreaView>
    )

  };

  const RegisterSection = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Not yet Scanned');
    const [alertVisible, setAlertVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    useEffect(() => {
      const getCameraPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      };

      if (hasPermission === null) {
        getCameraPermissions();
      }
    }, [hasPermission])

    const pushQR = async () => {
      try {
        await setDoc(doc(db, 'Registeration', text), {
          barcode: text,
          name: name,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error writing document: ', error);
      }
    };

    useEffect(() => {
      if (scanned && !alertVisible) {
        setAlertVisible(true);
        setModalVisible(true);
      }
    }, [scanned, alertVisible, text]);

    // What happens when barcode is scanned
    const handleBarCodeScanned = ({ type, data }) => {
      setText(data);
      setScanned(true);

    };


    const handleSubmit = () => {
      setModalVisible(false);
      pushQR().then(() => {
        setScanned(false);
        setAlertVisible(false);
        setName(''); // Clear the name input after submission
      });
    };

    if (hasPermission === false) {
      return (
        <View style={styles.container}>
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>Please allow access to camera</Text>
            <Button title="Allow Camera" onPress={() => setHasPermission(null)} />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.cameraContainer}>
        {hasPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : (
          <>
            <StatusBar barStyle="dark-content" backgroundColor="black" />
            <View style={styles.header}>
              {renderBackButton()}
              <Text style={styles.headerText}>Register</Text>
            </View>
            <View style={styles.cameraFrame}>
              <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr", "pdf417"],
                }}
                style={{ width: 400 * scaleFactor * 0.8, height: 550 * scaleFactor * 0.8, }}
              />
              <LottieView
                source={require('./assets/scan_qr_animation.json')}
                style={styles.Scanner}
                autoPlay loop
              />


              <Text style={styles.scanHintText}>
                Cannot Scan QR Code? click here..
              </Text>

            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Enter employee name</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={setName}
                    value={name}
                    placeholder="Name"
                  />
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.textStyle}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        )}
      </View>
    );
  }
  const CalendarSection = () => (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {renderBackButton()}
        <Text style={styles.headerTitle}>
          Calendar Section
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.contentTitle}>
          Events This Week
        </Text>
        <EventItem
          date="Mon, Jan 10"
          time="3:00 PM - 5:00 PM"
          title="Meeting with Team"
          location="Office Conference Room"
        />
        <EventItem
          date="Thu, Jan 13"
          time="10:00 AM - 12:00 PM"
          title="Client Presentation"
          location="Online"
        />
        <EventItem
          date="Sat, Jan 15"
          time="6:00 PM - 8:00 PM"
          title="Dinner with Friends"
          location="Local Restaurant"
        />
      </View>
    </View>
  );

  const TaskItem = (
    {
      title,
      description
    }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>
        {title}
      </Text>
      <Text style={styles.taskDescription}>
        {description}
      </Text>
    </View>
  );

  const EventItem = (
    { date, time,
      title, location
    }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventDateTime}>
        <Text style={styles.eventDate}>
          {date}
        </Text>
        <Text style={styles.eventTime}>
          {time}
        </Text>
      </View>
      <Text style={styles.eventTitle}>
        {title}
      </Text>
      <Text style={styles.eventLocation}>
        {location}
      </Text>
    </View>
  );
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    item: {

      padding: 10,
      marginVertical: 10,
      marginHorizontal: 10,
      backgroundColor: 'white',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'black',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonClose: {
      backgroundColor: '#b90000',
      color: 'white',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      color: 'white',
      marginBottom: 15,
      textAlign: 'center',
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      width: 200,
    },

    header: {
      flexDirection: 'row',
      alignContent: 'center',
      backgroundColor: 'black',
      padding: 20,
      height: 80,
    },
    headerText: {
      color: '#fff',
      fontSize: 20,
      alignSelf: 'center',
      fontWeight: 'bold',
    },
    cameraFrame: {
      flex: 1,
    },
    scanHintText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      alignSelf: 'center',
      margin: 15,
    },
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    headerContainer: {
      width: '100%',
      margin: 0,
      backgroundColor: '#b90000',
      padding: 20,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      elevation: 5,
    },
    headerTitle: {
      fontSize: 35,
      fontWeight: 'bold',
      color: 'white',
      fontFamily: 'Dancing Script',
      justifySelf: 'center',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#b90000',
      color: 'white',
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    featuresContainer: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginTop: 20,
      justifySelf: 'center',
      alignSelf: 'center',
    },
    Scanner: {
      width: 400 * scaleFactor * 0.8,
      height: 400 * scaleFactor * 0.8,
      marginTop: 40 * scaleFactor * 0.8,
      position: 'absolute',
    },
    featureBox: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '45%',
      aspectRatio: 1,
      backgroundColor: 'white',
      borderRadius: 10,
      marginVertical: 10,
      elevation: 5,
    },
    featureName: {
      marginTop: 10,
      fontSize: 14,
      fontWeight: 'bold',
      color: 'black',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButtonText: {
      color: '#3498db',
      fontSize: 16,
      marginLeft: 10,
    },
    contentContainer: {
      flex: 1,
      padding: 20,
    },
    contentText: {
      fontSize: 16,
      marginBottom: 10,
      color: '#555',
    },
    contentTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    taskItem: {
      backgroundColor: '#3498db',
      borderRadius: 10,
      padding: 15,
      marginVertical: 10,
    },
    taskTitle: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    taskDescription: {
      color: 'white',
      fontSize: 14,
      marginTop: 5,
    },
    eventItem: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      marginVertical: 10,
      elevation: 5,
    },
    eventDateTime: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    eventDate: {
      color: '#3498db',
      fontSize: 16,
      fontWeight: 'bold',
    },
    eventTime: {
      color: '#555',
      fontSize: 16,
    },
    eventTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    eventLocation: {
      fontSize: 14,
      color: '#777',
    },
  });

  return <View style={styles.container}>
    {renderSection()}
  </View>;
};
// const pushEmployeesToFirestore = async (employees) => {

//    employees.forEach(employee => {
//     try {
//         setDoc(doc(db, 'Employees', employee.id), {
//         ID: employee.id,
//         Name: employee.name,
//       });
//     } catch (error) {
//       console.error('Error writing document: ', error);
//     }
//   });

//   console.log('All employees have been added to Firestore');
// };

export default App = () => {

  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false);
    }, 2500);
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const Stack = createStackNavigator();

  useEffect(() => {
    const loadAsyncData = async () => {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        // Handle error loading fonts (e.g., show an error message)
      }
    };

    loadAsyncData();
  }, []); // Run once on component mount



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    setLoading(true);
    try {
      if (user) {
        await signOut(auth);
        console.log('User logged out successfully!');
      } else {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
        }
      }
      setEmail('');
      setPassword('');
    } catch (error) {
      const INVALID_EMAIL = 'Firebase: Error (auth/invalid-email).';
      const INVALID_CREDENTIAL = 'Firebase: Error (auth/invalid-credential).';
      const NETWORK_ERROR = 'Firebase: Error (auth/network-request-failed).';
      console.error('Authentication error:', error.message);
      // Display custom alert for incorrect credentials
      if (error.message === INVALID_EMAIL
        || error.message === INVALID_CREDENTIAL) {
        Alert.alert(
          "Authentication Failed",
          "Incorrect credentials. Please try again.",
          [
            { text: "OK" }
          ]
        );
      } else if (error.message === NETWORK_ERROR) {
        Alert.alert(
          "No Internet Connection",
          "Please check your internet and try again.",
          [
            { text: "OK" }
          ]
        );
      }
      else {
        Alert.alert(
          "Authentication Failed",
          error.message,
          [
            { text: "OK" }
          ]
        );
      }

      setEmail('');
      setPassword('');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }

  return (

    <>{(isShowSplash || !fontsLoaded) ? <SplashScreen /> : <ScrollView contentContainerStyle={styles.container}>

      {user ? (

        <DashboardApp user={user} handleAuthentication={handleAuthentication} />
      ) : (
        <AuthScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          handleAuthentication={handleAuthentication}
          loading={loading}
        />
        /* <DashboardApp user={user} handleAuthentication={handleAuthentication} /> */
      )}
    </ScrollView>}
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    marginBottom: 26,
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  splashImage: {
    width: 500,
    height: 500,
  },
  icon: {
    width: 135 * scaleFactor * 0.6,
    height: 135 * scaleFactor * 0.6,
    padding: 6 * scaleFactor * 0.6,
  },
  container: {
    width: '100%',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'black',
  },
  authContainer: {
    width: '95%',
    maxWidth: 700,
    backgroundColor: '#252525',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 100,
  },
  btnSignIn: {
    color: 'white',
    fontWeight: 'bold',
  },
  kovacsTittle: {
    fontSize: 25,
    fontFamily: 'LibreBaskervillie',
    marginBottom: 26,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1.2,
    fontSize: 17,
    marginBottom: 16,
    color: '#fff',
    padding: 8,
    borderRadius: 10,
  },
  buttonContainer: {
    backgroundColor: '#b90000',
    marginBottom: 12,
    borderRadius: 15,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
    color: '#fff',
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
});

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      // Handle successful logout (e.g., navigate to login screen)
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return <Button title="Logout" style={{ backgroundColor: 'white' }} onPress={handleLogout} />;
};

export { auth };
