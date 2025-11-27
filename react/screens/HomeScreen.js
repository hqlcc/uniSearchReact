import React, { useState, useMemo, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { saveFavorite } from "../storage/favorites";

export default function HomeScreen({ navigation }) {
  const [country, setCountry] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [resultsList, setResultsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const canSearch = useMemo(
    () => country.trim().length > 0 || universityName.trim().length > 0,
    [country, universityName]
  );

  const buildUrl = useCallback(() => {
    const params = [];
    if (country.trim()) params.push(`country=${encodeURIComponent(country)}`);
    if (universityName.trim())
      params.push(`name=${encodeURIComponent(universityName)}`);
    return `http://universities.hipolabs.com/search?${params.join("&")}`;
  }, [country, universityName]);

  const onSearch = async () => {
    if (!canSearch) {
      Alert.alert("Atenção", "Informe ao menos País ou Universidade.");
      return;
    }
    try {
      setLoading(true);
      const url = buildUrl();
      const resp = await fetch(url);
      const data = await resp.json();
      const filtered = (data || []).filter(
        (u) => Array.isArray(u.web_pages) && u.web_pages[0]
      );
      setResultsList(filtered);
    } catch {
      Alert.alert("Erro", "Falha na busca, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handlePressItem = async (item) => {
    const url = Array.isArray(item.web_pages) ? item.web_pages[0] : null;
    if (!url) {
      Alert.alert("Sem site", "Esse registro não possui web_pages.");
      return;
    }
    const favorite = { name: item.name, url };
    await saveFavorite(favorite);
    navigation.navigate("favoritos");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Buscar Universidades</Text>

        <TextInput
          placeholder="Nome do País"
          value={country}
          onChangeText={setCountry}
          style={styles.input}
        />
        <TextInput
          placeholder="Nome da Universidade"
          value={universityName}
          onChangeText={setUniversityName}
          style={styles.input}
        />

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, !canSearch && styles.buttonDisabled]}
            onPress={onSearch}
            disabled={!canSearch || loading}
          >
            <Text style={styles.buttonText}>PESQUISAR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonAccent}
            onPress={() => navigation.navigate("favoritos")}
          >
            <Text style={styles.buttonText}>FAVORITOS</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 16 }} />
        ) : (
          <FlatList
            data={resultsList}
            keyExtractor={(item, idx) => `${item.name}-${idx}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handlePressItem(item)}
                style={styles.listItem}
              >
                <Text style={styles.listItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const palette = {
  background: "#ffffff",
  inputBackground: "#f4f4f4",
  primary: "#1e88e5",
  accent: "#ff6f61",
  textPrimary: "#222",
  border: "#d0d0d0",
  card: "#fafafa",
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, padding: 24 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    color: palette.textPrimary,
  },
  input: {
    borderWidth: 2,
    borderColor: palette.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: palette.inputBackground,
  },
  row: { flexDirection: "row", gap: 12, marginBottom: 16 },
  button: {
    flex: 1,
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonAccent: {
    flex: 1,
    backgroundColor: palette.accent,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  listItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: palette.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.border,
    marginBottom: 12,
  },
  listItemText: { fontSize: 18, color: palette.textPrimary, lineHeight: 22 },
});
