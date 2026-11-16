
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../../App';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUser } from '../../../services/authService';

import TextInput from '../../../components/TextInput/TextInput';
import BaseButton from '../../../components/BaseButton/BaseButton';

import styles from './Register.styles';

type RegisterProps = NativeStackScreenProps<RootStackParamList, 'Register'>;

const Register = ({ navigation }: RegisterProps) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if ( !firstName.trim() || !lastName.trim() || !email.trim() || !password )
            return;

        try {
            const response = await registerUser({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
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
                'Register error:',
                apiError.response?.data?.message || 'Registration failed.'
                );
            } else {
                console.log('Register error:', error);
            }
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

                        <Text style={styles.title}>Create your account</Text>
                        <Text style={styles.subtitle}>
                            Start building your professional CV. Create an account and take the next step toward your future with CvMaker.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <TextInput
                            label="First Name"
                            name="firstName"
                            value={firstName}
                            onChange={setFirstName}
                            placeholder="Enter your first name"
                            type="text"
                            required
                        />

                        <TextInput
                            label="Last Name"
                            name="lastName"
                            value={lastName}
                            onChange={setLastName}
                            placeholder="Enter your last name"
                            type="text"
                            required
                        />

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

                        <BaseButton title="Create Account" onPress={handleRegister} />

                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>
                            Already have an account?
                            </Text>

                            <TouchableOpacity onPress={() => navigation.navigate('Login')} >
                                <Text style={styles.registerLink}> Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default Register;
