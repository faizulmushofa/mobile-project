import { styles } from '@/styles/home.styles';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<'beranda' | 'batch' | 'pesanan' | 'profil'>('beranda');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida/AEtjO1Xs4k7Jon22hj0ckqH30nqlbTUYsfm2wqSc9P-OafoOXtF_dvKtlocDQ-3kG2Ook43u99KsKt4IiGTB2ialb2euqHLt9gQ4O9ppxCTR1_-UGPND4Ww_Ly3BKOks8EBiTgVnLadMf3_CaHQ-1x10XExyMCQ4RXpVECi7F4JcJJRrcZlB3DqtHjj68rPqdR6akwimJRoKXzOXKFnBgafaEaj2zgRiYeqGaP7s5hXVVPmDrAY09ciB4XOB8eLa',
            }}
            style={styles.headerLogo}
            contentFit="contain"
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerSubtitle}>Catatan Jejak Kopi</Text>
            <Text style={styles.headerTitle}>Beranda</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.profileAvatar}
          activeOpacity={0.8}
          onPress={() => router.replace('/')}>
          <MaterialIcons name="person" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Centered Main Content ("Next Update") */}
      <View style={styles.content}>
        {/* Rocket Badge */}
        <View style={styles.rocketContainer}>
          <View style={styles.rocketCircle}>
            <MaterialIcons name="rocket-launch" size={40} color="#2563eb" />
          </View>
          <View style={styles.sparkleBadge}>
            <MaterialIcons name="auto-awesome" size={14} color="#ffffff" />
          </View>
        </View>

        {/* Status Pill */}
        <View style={styles.statusPill}>
          <View style={styles.pulseDot} />
          <Text style={styles.statusPillText}>Fitur Segera Hadir</Text>
        </View>

        {/* Title & Slogan */}
        <Text style={styles.mainTitle}>Next Update</Text>
        <Text style={styles.mainDescription}>
          Dashboard utama sedang dipersiapkan untuk pembaruan berikutnya.
        </Text>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <MaterialIcons name="info" size={20} color="#2563eb" />
          <Text style={styles.infoCardText}>
            Sistem pencatatan batch & penelusuran kopi tetap aktif melalui menu navigasi di bawah.
          </Text>
        </View>

        {/* Notify Button */}
        <TouchableOpacity style={styles.notifyButton} activeOpacity={0.85}>
          <MaterialIcons name="notifications" size={18} color="#ffffff" />
          <Text style={styles.notifyButtonText}>Beri Tahu Saya</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('beranda')}
          activeOpacity={0.7}>
          <MaterialIcons
            name="home"
            size={24}
            color={activeTab === 'beranda' ? '#2563eb' : '#434655'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'beranda' && styles.navLabelActive,
            ]}>
            Beranda
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('batch')}
          activeOpacity={0.7}>
          <MaterialIcons
            name="inventory-2"
            size={24}
            color={activeTab === 'batch' ? '#2563eb' : '#434655'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'batch' && styles.navLabelActive,
            ]}>
            Batch
          </Text>
        </TouchableOpacity>

        {/* Center Floating QR Scan Action Button */}
        <View style={styles.qrButtonWrapper}>
          <TouchableOpacity style={styles.qrButton} activeOpacity={0.9}>
            <MaterialIcons name="qr-code-scanner" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('pesanan')}
          activeOpacity={0.7}>
          <MaterialIcons
            name="local-shipping"
            size={24}
            color={activeTab === 'pesanan' ? '#2563eb' : '#434655'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'pesanan' && styles.navLabelActive,
            ]}>
            Pesanan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('profil')}
          activeOpacity={0.7}>
          <MaterialIcons
            name="account-circle"
            size={24}
            color={activeTab === 'profil' ? '#2563eb' : '#434655'}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'profil' && styles.navLabelActive,
            ]}>
            Profil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
