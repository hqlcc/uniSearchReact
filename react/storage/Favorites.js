import AsyncStorage from "@react-native-async-storage/async-storage";

const favoritesKey = "@favorites";

export async function loadFavorites() {
  try {
    const raw = await AsyncStorage.getItem(favoritesKey);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
    return [];
  }
}

export async function saveFavorite(item) {
  try {
    const current = await loadFavorites();

    const alreadyExists = current.some((fav) => fav.url === item.url);
    if (!alreadyExists) {
      const updated = [...current, item];
      await AsyncStorage.setItem(favoritesKey, JSON.stringify(updated));
    }
  } catch (error) {
    console.error("Erro ao salvar favorito:", error);
  }
}

export async function removeFavoriteByUrl(url) {
  try {
    const current = await loadFavorites();
    const filtered = current.filter((fav) => fav.url !== url);

    await AsyncStorage.setItem(favoritesKey, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    return [];
  }
}
