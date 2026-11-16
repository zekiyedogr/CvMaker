
import { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/Auth/Login/Login';
import RegisterScreen from './src/screens/Auth/Register/Register';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

import AddProfile from './src/screens/Profile/AddProfile/AddProfile';
import EditProfile from './src/screens/Profile/EditProfile/EditProfile';

import CreateCv from './src/screens/Cv/CreateCv/CreateCv';
import EditCv from './src/screens/Cv/EditCv/EditCv';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    AddProfile: undefined;
    EditProfile: { profileId: number };
    CreateCv: { profileId: number };
    EditCv: { Id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
    const [initialRoute, setInitialRoute] =
        useState<'Login' | 'Home' | null>(null);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');

                setInitialRoute(token ? 'Home' : 'Login');
            } catch (error) {
                console.log('Token kontrol hatası:', error);
                setInitialRoute('Login');
            }
        };

        checkToken();
    }, []);

    if (initialRoute === null) {
        return (
            <SafeAreaProvider>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" />
                </View>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <StatusBar barStyle="dark-content" />

            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName={initialRoute}
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="Home" component={BottomTabNavigator} />
                    
                    <Stack.Screen name="AddProfile" component={AddProfile} />
                    <Stack.Screen name="EditProfile" component={EditProfile} />

                    <Stack.Screen name="CreateCv" component={CreateCv} />
                    <Stack.Screen name="EditCv" component={EditCv} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default App;
