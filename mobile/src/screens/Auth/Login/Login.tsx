import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../../App';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../../../services/authService';

import TextInput from '../../../components/TextInput/TextInput';
import BaseButton from '../../../components/BaseButton/BaseButton';

import styles from './Login.styles';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = ({ navigation }: LoginProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email.trim() || !password)
            return;

        try {
            const response = await loginUser({
                email: email.trim(),
                password,
            });

            await AsyncStorage.setItem('token', response.token);
            navigation.navigate('Home');
        }
        catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const apiError = error as {
                    response?: {
                        data?: {
                            message?: string;
                        };
                    };
                };

                console.log(
                    'Login error:',
                    apiError.response?.data?.message || 'Login failed.'
                );
            }
            else
                console.log('Login error:', error);
        }
    };

    return (
        <View style={styles.background}>
            <Image
                source={require('../../../assets/images/city.jpg')}
                style={styles.backgroundImage}
                resizeMode="cover"
            />
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.panel}>
                        <View style={styles.header}>
                            <Image
                                source={require('../../../assets/images/CvMaker-Logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />

                            <Text style={styles.title}>Sign in with email</Text>
                            <Text style={styles.subtitle}>
                                Create a professional CV that tells your story and highlights
                                your strengths. Build your future with CvMaker.
                            </Text>
                        </View>

                        <View style={styles.form}>
                            <TextInput
                                label="Email"
                                name="email"
                                value={email}
                                onChange={setEmail}
                                placeholder="Enter your email"
                                type="email"
                                required
                            />

                            <TextInput
                                label="Password"
                                name="password"
                                value={password}
                                onChange={setPassword}
                                placeholder="Enter your password"
                                type="password"
                                required
                            />

                            <BaseButton title="Get Started" onPress={handleLogin} />

                            <View style={styles.registerContainer}>
                                <Text style={styles.registerText}> Don't you have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Register')} >
                                    <Text style={styles.registerLink}> Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default Login;