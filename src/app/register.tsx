import { useAuth } from '@/hooks/use-auth';
import { styles } from '@/styles/register.styles';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { register, loading } = useAuth();

  const handleRegisterSubmit = async () => {
    if (!fullName.trim()) {
      Alert.alert('Perhatian', 'Nama lengkap wajib diisi.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Perhatian', 'Email wajib diisi.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Perhatian', 'Format email tidak valid.');
      return;
    }
    if (!password || password.length < 8) {
      Alert.alert('Perhatian', 'Kata sandi minimal 8 karakter.');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('Perhatian', 'Harap setujui Syarat & Ketentuan serta Kebijakan Privasi.');
      return;
    }

    const res = await register(fullName, email, password, {
      phone: waPhone,
      location,
    });

    if (res.success) {
      Alert.alert(
        'Pendaftaran Berhasil',
        `Akun ${fullName} (${email}) berhasil didaftarkan ke data dummy! Silakan masuk dengan akun ini.`,
        [
          {
            text: 'Masuk Sekarang',
            onPress: () => router.replace('/'),
          },
        ]
      );
    } else {
      Alert.alert('Gagal Mendaftar', res.message || 'Terjadi kesalahan saat pendaftaran.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9ff" />

      {/* Ambient background decoration */}
      <View style={styles.ambientTopGlow} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* Header Navigation */}
          <View style={styles.navHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
              accessibilityLabel="Kembali ke halaman masuk">
              <MaterialIcons name="arrow-back" size={22} color="#121c2a" />
            </TouchableOpacity>
          </View>

          {/* Brand Intro & Header */}
          <View style={styles.brandSection}>
            <View style={styles.logoContainer}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida/AEtjO1Xs4k7Jon22hj0ckqH30nqlbTUYsfm2wqSc9P-OafoOXtF_dvKtlocDQ-3kG2Ook43u99KsKt4IiGTB2ialb2euqHLt9gQ4O9ppxCTR1_-UGPND4Ww_Ly3BKOks8EBiTgVnLadMf3_CaHQ-1x10XExyMCQ4RXpVECi7F4JcJJRrcZlB3DqtHjj68rPqdR6akwimJRoKXzOXKFnBgafaEaj2zgRiYeqGaP7s5hXVVPmDrAY09ciB4XOB8eLa',
                }}
                style={styles.logoImage}
                contentFit="contain"
              />
              <View style={styles.ecoBadge}>
                <MaterialIcons name="eco" size={13} color="#ffffff" />
              </View>
            </View>

            <Text style={styles.pageTitle}>Daftar Akun Baru</Text>
            <Text style={styles.pageSubtitle}>
              Mulai catat kebun kopi Setiap langkah, buktikan kualitas kopimu. .
            </Text>
          </View>

          {/* Registration Form Card */}
          <View style={styles.card}>
            {/* Field 1: Nama Lengkap */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nama Lengkap</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="person-outline"
                  size={20}
                  color="#555f70"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Anon"
                  placeholderTextColor="#737686"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            {/* Field 2: Email */}
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
                  placeholder="contoh@gmail.com"
                  placeholderTextColor="#737686"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Field 2: Nomor WhatsApp / HP */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nomor Telepon</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="smartphone"
                  size={20}
                  color="#555f70"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="08123456789"
                  placeholderTextColor="#737686"
                  value={waPhone}
                  onChangeText={setWaPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Field 4: Asal Wilayah / Kebun */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Asal Wilayah</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="location-on"
                  size={20}
                  color="#555f70"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="lokasi..."
                  placeholderTextColor="#737686"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>

            {/* Field 5: Buat Kata Sandi */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Buat Kata Sandi</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="lock-outline"
                  size={20}
                  color="#555f70"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Minimal 8 karakter"
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

            {/* Checkbox Persetujuan */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreeTerms(!agreeTerms)}
              activeOpacity={0.8}>
              <View
                style={[
                  styles.checkboxBox,
                  agreeTerms && styles.checkboxChecked,
                ]}>
                {agreeTerms && (
                  <MaterialIcons name="check" size={14} color="#ffffff" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                Saya menyetujui{' '}
                <Text style={styles.checkboxLink}>Syarat & Ketentuan</Text> dan{' '}
                <Text style={styles.checkboxLink}>Kebijakan Privasi</Text> Catatan Jejak Kopi.
              </Text>
            </TouchableOpacity>

            {/* Submit Action Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && { opacity: 0.7 }]}
              activeOpacity={0.85}
              disabled={loading}
              onPress={handleRegisterSubmit}>
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Daftar Sekarang</Text>
                  <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Link to Login */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>Sudah punya akun?</Text>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}>
              <Text style={styles.loginLink}>Masuk di sini</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
