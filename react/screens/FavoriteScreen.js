import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { loadFavorites, removeFavoriteByUrl } from "../storage/favorites";

export default function FavoritesScreen() {
  const [favoriteList, setFavoriteList] = useState([]);

  useEffect(() => {
    const fetchData = async () => setFavoriteList(await loadFavorites());
    fetchData();
  }, []);

  const removeItem = async (url) => {
    const updatedList = await removeFavoriteByUrl(url);
    setFavoriteList(updatedList);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Favoritos</Text>

        {favoriteList.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum favorito salvo ainda.</Text>
        ) : (
          <FlatList
            data={favoriteList}
            keyExtractor={(item, idx) => `${item.url}-${idx}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => removeItem(item.url)}
                style={styles.listItem}
              >
                <Text style={styles.listItemText}>{item.url}</Text>
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
  card: "#fafafa",
  textPrimary: "#222",
  textSecondary: "#666",
  accent: "#ff6f61",
  border: "#d0d0d0",
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
  emptyText: { fontSize: 16, color: palette.textSecondary },
  listItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: palette.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.border,
    marginBottom: 12,
  },
  listItemText: { fontSize: 18, color: palette.textPrimary },
});
