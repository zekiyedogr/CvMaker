import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { getCurrentUser } from '../../services/authService';
import colors from '../../constants/colors';

import styles from './Home.styles';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface User {
  FirstName: string;
  LastName: string;
  Email: string;
}

const Home = ({ navigation }: HomeProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.log('User information error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>User information could not be retrieved.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>My Dashboard</Text>
        <Text style={styles.subtitle}>Welcome to CvMaker!</Text>
      </View>

      <View style={styles.userInfoCard}>
        <View style={styles.userAvatar}>
          <Text style={styles.avatarText}>
            {user.FirstName?.charAt(0)}
            {user.LastName?.charAt(0)}
          </Text>
        </View>

        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {user.FirstName} {user.LastName}
          </Text>

          <Text style={styles.email}>
            {user.Email}
          </Text>

          <Text style={styles.member}>
            CvMaker Member
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} >
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
