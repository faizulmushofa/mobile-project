import { useAuth } from "@/hooks/use-auth";
import { fetchAllBatches, verifyBatchCode } from "@/services/batch-service";
import { styles } from "@/styles/home.styles";
import { CoffeeBatch } from "@/types/coffee";
import { MaterialIcons } from "@expo/vector-icons";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export interface ScannedData {
  type: string;
  data: string;
  timestamp: string;
}

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<
    "beranda" | "batch" | "pesanan" | "profil"
  >("beranda");
  const { logout, user } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [scanned, setScanned] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<ScannedData | null>(null);
  const [enableTorch, setEnableTorch] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifiedBatch, setVerifiedBatch] = useState<CoffeeBatch | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [batches, setBatches] = useState<CoffeeBatch[]>([]);
  const [batchLoading, setBatchLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (activeTab === "batch") {
      fetchAllBatches()
        .then((data) => {
          if (isMounted) {
            setBatches(data);
            setBatchLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setBatches([]);
            setBatchLoading(false);
          }
        });
    }
    return () => {
      isMounted = false;
    };
  }, [activeTab]);
  const handleOpenScanner = async () => {
    if (!permission) {
      Alert.alert("Memuat", "Sedang memeriksa izin kamera...");
      return;
    }

    if (permission.granted) {
      setScanned(false);
      setEnableTorch(false);
      setIsCameraOpen(true);
      return;
    }

    try {
      const response = await requestPermission();
      if (response.granted) {
        setScanned(false);
        setEnableTorch(false);
        setIsCameraOpen(true);
      } else {
        if (!response.canAskAgain) {
          Alert.alert(
            "Izin Kamera Ditolak",
            "Akses kamera telah dinonaktifkan. Silakan aktifkan izin kamera melalui Pengaturan perangkat untuk menggunakan fitur pemindai.",
            [
              { text: "Batal", style: "cancel" },
              {
                text: "Buka Pengaturan",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        } else {
          Alert.alert(
            "Izin Dibutuhkan",
            "Izin kamera diperlukan untuk memindai barcode atau QR code."
          );
        }
      }
    } catch {
      Alert.alert("Error", "Gagal meminta izin akses kamera.");
    }
  };
  const handleCloseCamera = () => {
    setIsCameraOpen(false);
    setEnableTorch(false);
  };

    const handleRunVerification = (codeToVerify: string) => {
    setIsVerifying(true);

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    setScannedResult({
      type: "QR / Barcode",
      data: codeToVerify,
      timestamp: timeFormatted,
    });

    verifyBatchCode(codeToVerify)
      .then((batchData) => {
        setVerifiedBatch(batchData);
        setVerificationError(null);
        setShowVerificationModal(true);
      })
      .catch((error: Error) => {
        setVerifiedBatch(null);
        setVerificationError(
          error.message || "Kode barcode tidak terdaftar di sistem Jejak Kopi."
        );
        setShowVerificationModal(true);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  };

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    setScanned(true);
    setIsCameraOpen(false);
    setEnableTorch(false);

    handleRunVerification(result.data);
  };

  const handleLogout = () => {
    const doLogout = async () => {
      try {
        if (logout) await logout();
      } catch (err) {
        console.warn(err);
      }
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace("/");
    };

    if (Platform.OS === "web") {
      const confirmed = typeof window !== "undefined" ? window.confirm("Apakah Anda yakin ingin keluar?") : true;
      if (confirmed) {
        doLogout();
      }
    } else {
      Alert.alert("Konfirmasi Keluar", "Apakah Anda yakin ingin keluar?", [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar",
          style: "destructive",
          onPress: doLogout,
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida/AEtjO1Xs4k7Jon22hj0ckqH30nqlbTUYsfm2wqSc9P-OafoOXtF_dvKtlocDQ-3kG2Ook43u99KsKt4IiGTB2ialb2euqHLt9gQ4O9ppxCTR1_-UGPND4Ww_Ly3BKOks8EBiTgVnLadMf3_CaHQ-1x10XExyMCQ4RXpVECi7F4JcJJRrcZlB3DqtHjj68rPqdR6akwimJRoKXzOXKFnBgafaEaj2zgRiYeqGaP7s5hXVVPmDrAY09ciB4XOB8eLa",
            }}
            style={styles.headerLogo}
            contentFit="contain"
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerSubtitle}>Traceability & Verification</Text>
            <Text style={styles.headerTitle}>
              {activeTab === "beranda"
                ? "Jejak Kopi"
                : activeTab === "batch"
                  ? "Batch Kopi"
                  : activeTab === "pesanan"
                    ? "Pesanan"
                    : "Profil Saya"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.profileAvatar}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <MaterialIcons name="person" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "beranda" && (
          <View>
            <View style={styles.heroCard}>
              <View style={styles.heroIconCircle}>
                <MaterialIcons name="qr-code-scanner" size={40} color="#2563eb" />
              </View>
              <Text style={styles.heroTitle}>Verifikasi Keaslian Kopi</Text>
              <Text style={styles.heroSubtitle}>
                Arahkan kamera ke barcode kemasan untuk memverifikasi asal kebun,
                petani, dan proses sangrai secara real-time.
              </Text>

              <TouchableOpacity
                style={styles.scanTriggerButton}
                activeOpacity={0.85}
                onPress={handleOpenScanner}
              >
                <MaterialIcons name="camera-alt" size={20} color="#ffffff" />
                <Text style={styles.scanTriggerButtonText}>Buka Pemindai Barcode</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === "batch" && (
          <View>
            {batchLoading ? (
              <View style={styles.emptyResultCard}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.emptyResultTitle}>Memuat Batch...</Text>
              </View>
            ) : batches.length === 0 ? (
              <View style={styles.emptyResultCard}>
                <View style={styles.emptyResultIconWrapper}>
                  <MaterialIcons name="inventory-2" size={36} color="#94a3b8" />
                </View>
                <Text style={styles.emptyResultTitle}>Belum Ada Batch</Text>
                <Text style={styles.emptyResultText}>
                  Data batch kopi belum tersedia di server.
                </Text>
              </View>
            ) : (
            batches.map((batch) => (
              <View key={batch.id} style={styles.passportCard}>
                <View style={styles.passportHeader}>
                  <View style={styles.passportBatchBadge}>
                    <Text style={styles.passportBatchBadgeText} numberOfLines={1}>
                      {batch.batchCode}
                    </Text>
                  </View>
                  <View style={styles.passportStatusBadge}>
                    <MaterialIcons name="verified" size={13} color="#10b981" />
                    <Text style={styles.passportStatusText} numberOfLines={1}>
                      Terverifikasi
                    </Text>
                  </View>
                </View>
                <Text style={styles.passportCoffeeTitle}>{batch.coffeeName}</Text>
                <View style={styles.passportGrid}>
                  <View style={styles.passportRow}>
                    <View style={styles.passportLabelGroup}>
                      <MaterialIcons name="place" size={15} color="#64748b" />
                      <Text style={styles.passportLabel}>Asal Kebun</Text>
                    </View>
                    <Text style={styles.passportValue}>{batch.origin}</Text>
                  </View>

                  <View style={styles.passportRow}>
                    <View style={styles.passportLabelGroup}>
                      <MaterialIcons name="terrain" size={15} color="#64748b" />
                      <Text style={styles.passportLabel}>Ketinggian</Text>
                    </View>
                    <Text style={styles.passportValue}>{batch.altitude}</Text>
                  </View>

                  <View style={styles.passportRow}>
                    <View style={styles.passportLabelGroup}>
                      <MaterialIcons name="person" size={15} color="#64748b" />
                      <Text style={styles.passportLabel}>Kelompok Tani</Text>
                    </View>
                    <Text style={styles.passportValue}>{batch.farmer}</Text>
                  </View>

                  <View style={styles.passportRow}>
                    <View style={styles.passportLabelGroup}>
                      <MaterialIcons name="science" size={15} color="#64748b" />
                      <Text style={styles.passportLabel}>Proses Olah</Text>
                    </View>
                    <Text style={styles.passportValue}>{batch.processMethod}</Text>
                  </View>

                  <View style={styles.passportRow}>
                    <View style={styles.passportLabelGroup}>
                      <MaterialIcons name="event" size={15} color="#64748b" />
                      <Text style={styles.passportLabel}>Tgl Sangrai</Text>
                    </View>
                    <Text style={styles.passportValue}>{batch.roastDate}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.passportDetailButton}
                  activeOpacity={0.85}
                  onPress={() => handleRunVerification(batch.batchCode)}
                >
                  <MaterialIcons name="security" size={18} color="#ffffff" />
                  <Text style={styles.passportDetailButtonText}>
                    Detail Sertifikasi
                  </Text>
                </TouchableOpacity>
              </View>
            )))}
          </View>
        )}

        {activeTab === "pesanan" && (
          <View style={styles.emptyResultCard}>
            <View style={styles.emptyResultIconWrapper}>
              <MaterialIcons name="local-shipping" size={36} color="#94a3b8" />
            </View>
            <Text style={styles.emptyResultTitle}>Riwayat Pesanan</Text>
            <Text style={styles.emptyResultText}>
              Seluruh pesanan kopi terverifikasi dan status pengiriman Anda akan
              tampil di sini.
            </Text>
          </View>
        )}

        {activeTab === "profil" && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Profil Pengguna</Text>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>Aktif</Text>
              </View>
            </View>
            <View style={styles.resultDataBox}>
              <Text style={styles.resultDataLabel}>Nama Pengguna</Text>
              <Text style={styles.resultDataText}>
                {user?.user_metadata?.full_name ||
                  user?.email?.split("@")[0] ||
                  "Pengguna Jejak Kopi"}
              </Text>
              <Text style={[styles.resultDataLabel, { marginTop: 10 }]}>Email</Text>
              <Text style={styles.resultDataText}>{user?.email || "-"}</Text>
              {user?.user_metadata?.location ? (
                <>
                  <Text style={[styles.resultDataLabel, { marginTop: 10 }]}>
                    Asal Wilayah
                  </Text>
                  <Text style={styles.resultDataText}>
                    {user.user_metadata.location}
                  </Text>
                </>
              ) : null}
              <Text style={[styles.resultDataLabel, { marginTop: 10 }]}>
                ID Pengguna (Supabase UID)
              </Text>
              <Text
                style={[
                  styles.resultDataText,
                  { fontSize: 11, color: "#64748b" },
                ]}
              >
                {user?.id || "-"}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.rescanButton, { backgroundColor: "#ef4444" }]}
              onPress={handleLogout}
              activeOpacity={0.85}
            >
              <MaterialIcons name="logout" size={18} color="#ffffff" />
              <Text style={styles.rescanButtonText}>Keluar Akun</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <Modal
        visible={showVerificationModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowVerificationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.verificationCard}>
            {verifiedBatch ? (
              <>
                <View
                  style={[
                    styles.verificationStatusBanner,
                    styles.statusBannerSuccess,
                  ]}
                >
                  <View style={styles.statusIconCircleSuccess}>
                    <MaterialIcons name="verified" size={36} color="#ffffff" />
                  </View>
                  <Text style={styles.statusTitleSuccess}>
                    PRODUK ASLI & TERVERIFIKASI
                  </Text>
                  <Text style={styles.statusSubtitle}>
                    Sertifikasi: {verifiedBatch.certificationNumber}
                  </Text>
                </View>

                <ScrollView
                  style={styles.verificationBody}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.productName}>{verifiedBatch.coffeeName}</Text>
                  <Text style={styles.productBatchCode}>
                    Kode Batch: {verifiedBatch.batchCode}
                  </Text>
                  <View style={styles.detailRowsContainer}>
                    <View style={styles.infoRow}>
                      <View style={styles.infoLabelContainer}>
                        <MaterialIcons name="place" size={16} color="#64748b" />
                        <Text style={styles.infoLabel}>Asal Kebun</Text>
                      </View>
                      <Text style={styles.infoValue}>{verifiedBatch.origin}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoLabelContainer}>
                        <MaterialIcons name="terrain" size={16} color="#64748b" />
                        <Text style={styles.infoLabel}>Ketinggian</Text>
                      </View>
                      <Text style={styles.infoValue}>{verifiedBatch.altitude}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoLabelContainer}>
                        <MaterialIcons name="person" size={16} color="#64748b" />
                        <Text style={styles.infoLabel}>Petani/Kelompok</Text>
                      </View>
                      <Text style={styles.infoValue}>{verifiedBatch.farmer}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoLabelContainer}>
                        <MaterialIcons name="grain" size={16} color="#64748b" />
                        <Text style={styles.infoLabel}>Varietas Biji</Text>
                      </View>
                      <Text style={styles.infoValue}>{verifiedBatch.variety}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoLabelContainer}>
                        <MaterialIcons name="science" size={16} color="#64748b" />
                        <Text style={styles.infoLabel}>Metode Proses</Text>
                      </View>
                      <Text style={styles.infoValue}>
                        {verifiedBatch.processMethod}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoLabelContainer}>
                        <MaterialIcons name="local-fire-department" size={16} color="#64748b" />
                        <Text style={styles.infoLabel}>Level Sangrai</Text>
                      </View>
                      <Text style={styles.infoValue}>
                        {verifiedBatch.roastLevel}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoLabelContainer}>
                        <MaterialIcons name="event" size={16} color="#64748b" />
                        <Text style={styles.infoLabel}>Tanggal Sangrai</Text>
                      </View>
                      <Text style={styles.infoValue}>
                        {verifiedBatch.roastDate}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.notesTitle}>Profil Rasa (Cupping Notes)</Text>
                  <View style={styles.notesChipsRow}>
                    {verifiedBatch.flavorNotes.map((note, index) => (
                      <View key={index} style={styles.noteBadge}>
                        <Text style={styles.noteBadgeText}>{note}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={[styles.modalActionButtons, { marginBottom: 16 }]}>
                    <TouchableOpacity
                      style={styles.modalBtnSecondary}
                      onPress={() => setShowVerificationModal(false)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.modalBtnSecondaryText}>Tutup</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalBtnPrimary}
                      onPress={() => {
                        setShowVerificationModal(false);
                        handleOpenScanner();
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.modalBtnPrimaryText}>Scan Lain</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.verificationStatusBanner,
                    styles.statusBannerError,
                  ]}
                >
                  <View style={styles.statusIconCircleError}>
                    <MaterialIcons name="gpp-bad" size={36} color="#ffffff" />
                  </View>
                  <Text style={styles.statusTitleError}>
                    PRODUK TIDAK TERVERIFIKASI
                  </Text>
                  <Text style={styles.statusSubtitle}>
                    Kode: {scannedResult?.data || "Tidak Diketahui"}
                  </Text>
                </View>

                <View style={styles.verificationBody}>
                  <View style={styles.errorDetailBox}>
                    <Text style={styles.errorDetailText}>
                      {verificationError ||
                        "Kode barcode tidak terdaftar pada basis data resmi Jejak Kopi."}
                    </Text>
                  </View>

                  <View style={styles.warningAdviceBox}>
                    <MaterialIcons name="warning" size={20} color="#f59e0b" />
                    <Text style={styles.warningAdviceText}>
                      Waspada terhadap biji kopi tanpa jaminan asal-usul. Pastikan
                      selalu membeli kemasan resmi berlabel Jejak Kopi.
                    </Text>
                  </View>

                  <View style={styles.modalActionButtons}>
                    <TouchableOpacity
                      style={styles.modalBtnSecondary}
                      onPress={() => setShowVerificationModal(false)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.modalBtnSecondaryText}>Tutup</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.modalBtnPrimary,
                        { backgroundColor: "#ef4444" },
                      ]}
                      onPress={() => {
                        setShowVerificationModal(false);
                        handleOpenScanner();
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.modalBtnPrimaryText}>Coba Scan Lagi</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      <Modal
        visible={isCameraOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseCamera}
      >
        <SafeAreaView style={styles.cameraModalContainer} edges={["top", "bottom"]}>
          <StatusBar style="light" />

          {isCameraOpen && (
            <CameraView
              style={styles.cameraModalView}
              facing="back"
              enableTorch={enableTorch}
              barcodeScannerSettings={{
                barcodeTypes: [
                  "qr",
                  "ean13",
                  "ean8",
                  "code128",
                  "code39",
                  "upc_a",
                  "upc_e",
                ],
              }}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />
          )}

          <View style={styles.cameraModalOverlay}>
            <View style={styles.cameraTopBar}>
              <TouchableOpacity
                style={styles.cameraIconButton}
                onPress={handleCloseCamera}
                activeOpacity={0.8}
              >
                <MaterialIcons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>

              <Text style={styles.cameraTopTitle}>Arahkan ke Barcode</Text>

              <TouchableOpacity
                style={[
                  styles.cameraIconButton,
                  enableTorch && styles.cameraIconButtonActive,
                ]}
                onPress={() => setEnableTorch((prev) => !prev)}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name={enableTorch ? "flash-on" : "flash-off"}
                  size={22}
                  color={enableTorch ? "#fbbf24" : "#ffffff"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.targetFrame}>
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </View>

            <View style={styles.instructionPill}>
              <MaterialIcons
                name={scanned ? "check-circle" : "center-focus-strong"}
                size={16}
                color={scanned ? "#4ade80" : "#ffffff"}
              />
              <Text style={styles.instructionText}>
                {scanned
                  ? "Barcode Terdeteksi! Memverifikasi..."
                  : "Posisikan kode di dalam kotak"}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      {isVerifying && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Memverifikasi Keaslian...</Text>
            <Text style={styles.loadingSubtext}>
              Mencocokkan kode ke database Jejak Kopi
            </Text>
          </View>
        </View>
      )}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("beranda")}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="home"
            size={24}
            color={activeTab === "beranda" ? "#2563eb" : "#434655"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "beranda" && styles.navLabelActive,
            ]}
          >
            Beranda
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setBatchLoading(true);
            setActiveTab("batch");
          }}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="inventory-2"
            size={24}
            color={activeTab === "batch" ? "#2563eb" : "#434655"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "batch" && styles.navLabelActive,
            ]}
          >
            Batch
          </Text>
        </TouchableOpacity>
        <View style={styles.qrButtonWrapper}>
          <TouchableOpacity
            style={styles.qrButton}
            activeOpacity={0.9}
            onPress={handleOpenScanner}
          >
            <MaterialIcons name="qr-code-scanner" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("pesanan")}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="local-shipping"
            size={24}
            color={activeTab === "pesanan" ? "#2563eb" : "#434655"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "pesanan" && styles.navLabelActive,
            ]}
          >
            Pesanan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("profil")}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name="account-circle"
            size={24}
            color={activeTab === "profil" ? "#2563eb" : "#434655"}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === "profil" && styles.navLabelActive,
            ]}
          >
            Profil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
