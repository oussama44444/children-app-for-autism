import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import {useUser}  from '../contexts/userContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfileContent = ({ navigation }) => {
  const { user,} = useAuth();
  const {updateProfile} = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [saving, setSaving] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '🦁');

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const stored = await AsyncStorage.getItem('userAvatar');
        if (stored) {
          setSelectedAvatar(stored);
        } else if (user?.avatar) {
          setSelectedAvatar(user.avatar);
        }
      } catch (e) {
        console.warn('Failed to load stored avatar', e);
      }
    };
    loadAvatar();
  }, [user]);

  const handleSave = async () => {
    // Validation
    if (!firstName.trim()) {
      Alert.alert('Erreur', 'Le prénom est requis');
      return;
    }

    if (!lastName.trim()) {
      Alert.alert('Erreur', 'Le nom est requis');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Erreur', 'L\'email est requis');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erreur', 'Email invalide');
      return;
    }

    setSaving(true);
    try {
      const updatedData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        age: parseInt(age, 10) || 0,
        avatar: selectedAvatar,
      };

      const result = await updateProfile(updatedData);
      console.log('updateProfile result:', result);
      if (result && result.success) {
        try {
          await AsyncStorage.setItem('userAvatar', selectedAvatar);
        } catch (e) {
          console.warn('Failed to save avatar locally', e);
        }
        Alert.alert(
          'Succès ! 🎉',
          'Votre profil a été mis à jour avec succès.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
      }
    } catch (error) {
      console.error('updateProfile error:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setSaving(false);
    }
  };

  const avatarOptions = [
    '🦁', '🐯', '🐻', '🐼', '🦊', '🐨', '🐸', '🦉',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦝', '🐵', '🐔',
    '🦄', '🐷', '🐮', '🦆', '🐧', '🦜', '🦋', '🐝',
    '🐢', '🦖', '🦕', '🐙', '🦀', '🐬', '🦈', '🐳'
  ];
 

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le Profil</Text>
      </View>

      {/* Avatar Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choisir un avatar</Text>
        <View style={styles.avatarGrid}>
          {avatarOptions.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.avatarOption,
                selectedAvatar === emoji && styles.avatarOptionSelected,
              ]}
              onPress={() => setSelectedAvatar(emoji)}
            >
              <Text style={styles.avatarEmoji}>{emoji}</Text>
              {selectedAvatar === emoji && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedCheck}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre prénom"
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
          />

        </View>
                <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre nom"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="votre@email.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Numéro de téléphone</Text>
          <TextInput
            style={styles.input}
            placeholder="+216 XX XXX XXX"
            placeholderTextColor="#9CA3AF"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Age */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Âge</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre âge"
            placeholderTextColor="#9CA3AF"
            value={age}
            onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={2}
          />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        activeOpacity={0.8}
        disabled={saving}
      >
        <LinearGradient
          colors={saving ? ['#9CA3AF', '#6B7280'] : ['#A855F7', '#9333EA']}
          style={styles.saveButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications ✓'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Info */}
      <Text style={styles.infoText}>
        Ces informations sont utilisées pour personnaliser votre expérience.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 24,
    color: '#1F2937',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 16,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  avatarOption: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  avatarOptionSelected: {
    borderColor: '#A855F7',
    backgroundColor: '#FAF5FF',
  },
  avatarEmoji: {
    fontSize: 36,
  },
  selectedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  selectedCheck: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  form: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButton: {
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoText: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 16,
  },
});

export default EditProfileContent;
