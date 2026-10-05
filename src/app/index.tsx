import { styles } from '@/styles/login.styles';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9ff" />

      {/* Ambient background decoration */}
      <View style={styles.ambientTopLeft} />
      <View style={styles.ambientTopRight} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* Header & Brand Identity */}
          <View style={styles.headerSection}>
            <View style={styles.logoBadgeContainer}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida/AEtjO1XAd8LPuZrQAOeStTs9BbiwPEsamLbNPuWwSuWch95Gv1G0QoSxeerTyXmjyvLeywB4XWjQ92sD55XsrkdZ_nsQrvA-jTCwDF5kzvDfgsFDAszDfDmK-xSq5fi-Wn6dujGJrWR98Alr7nPK6xN5q6VS2xP--iDlMnE1h4e8yOYA0iX3_DE5jIuW2gWfUygNfvnuxt_fbk_9y_N-XWKk9TN1B4EQYnI86Uesiueo0vpC0PyzSEcn4qjIzy8',
                }}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>

            <Text style={styles.brandTitle}>Jejak Kopi</Text>
            <Text style={styles.brandSlogan}>
              Catat setiap langkah, buktikan kualitas kopimu.
            </Text>
          </View>

          {/* Primary Login Card */}
          <View style={styles.card}>
            {/* Field 1: Email / Nomor HP */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="alternate-email"
                  size={20}
                  color="#555f70"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="example@gmail.com"
                  placeholderTextColor="#737686"
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Field 2: Password */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.inputLabel}>Kata Sandi</Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.forgotPasswordText}>Lupa kata sandi?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="lock-outline"
                  size={20}
                  color="#555f70"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, styles.passwordInput]}
                  placeholder="••••••••••••"
                  placeholderTextColor="#737686"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}>
                  <MaterialIcons
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="#555f70"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Primary Action CTA */}
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => router.push('/home')}>
              <Text style={styles.primaryButtonText}>Masuk</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Footer Assistance */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              Belum punya akun?{' '}
              <Text
                style={styles.adminLink}
                onPress={() => router.push('/register')}>
                Daftar sekarang
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
