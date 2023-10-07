import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { supabase } from "./auth/supabase";
import Icon from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";

const ClosetUI = ({ route, navigation }) => {
  const { session } = route.params;
  const [photos, setPhotos] = useState([]);

  const isFocused = useIsFocused();

  const [hats, setHats] = useState([]);
  const [shirts, setShirts] = useState([]);
  const [pants, setPants] = useState([]);
  const [shoes, setShoes] = useState([]);
  const [accessories, setAccessories] = useState([]);

  // ... You can add more state variables for other clothing types if necessary

  const deletePictures = async (lastModified) => {
    try {
      const filename = `${session.user.id}/${session.user.id}-${lastModified}`;

      const { data: removeData, error: removeError } = await supabase.storage
        .from("user_pictures")
        .remove(filename);

      if (removeError) {
        throw removeError;
      }

      const { data: removeRow, error: rowError } = await supabase
        .from("user_images")
        .delete()
        .eq("user_id", session.user.id)
        .eq("last_modified", lastModified);

      if (rowError) {
        throw rowError;
      }

      if (removeData && removeRow) {
      }

      if (removeError) {
        alert(error.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchPhotoTimestampsFromDatabase = async () => {
    if (!session || !session.user) {
      console.error("No active session found.");
      return;
    }

    // Fetch last_modified timestamps for the user's images from the table
    const { data, error } = await supabase
      .from("user_images")
      .select("*")
      .eq("user_id", session.user.id);

    if (data) {
      const base_url =
        "https://vzdnrdsqkzwzihnqfong.supabase.co/storage/v1/object/public/user_pictures";

      const enrichedData = data.map((image) => ({
        ...image,
        url: `${base_url}/${session.user.id}/${session.user.id}-${image.last_modified}`,
      }));

      setPhotos(enrichedData);

      console.log(enrichedData.url); // Store the entire data array

      const hatsData = enrichedData.filter(
        (photo) => photo.clothing_type === "hat"
      );
      const shirtsData = enrichedData.filter(
        (photo) => photo.clothing_type === "shirt"
      );
      const pantsData = enrichedData.filter(
        (photo) => photo.clothing_type === "pants"
      );
      const shoesData = enrichedData.filter(
        (photo) => photo.clothing_type === "shoes"
      );
      const accessoriesData = enrichedData.filter(
        (photo) => photo.clothing_type === "accessories"
      );

      setHats(hatsData);
      setShirts(shirtsData);
      setPants(pantsData);
      setShoes(shoesData);
      setAccessories(accessoriesData);
    } else {
      console.error("Failed to fetch image metadata from database:", error);
    }
  };

  useEffect(() => {
    fetchPhotoTimestampsFromDatabase();
    if (isFocused) {
      fetchPhotoTimestampsFromDatabase();
    }
  }, [isFocused]);

  const renderDelete = (lastModified) => (
    <TouchableOpacity
      style={styles.button}
      onPress={async () => {
        await deletePictures(lastModified);
        await fetchPhotoTimestampsFromDatabase();
      }}
    >
      <Icon name="times" size={25} color="grey" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.mainHeader}>My Closet</Text>
      <ScrollView>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Hats</Text>
          <FlatList
            data={hats}
            extraData={photos}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => "hat_" + index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                {renderDelete(item.last_modified)}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ClothingItem", { item });
                  }}
                >
                  <Image source={{ uri: item.url }} style={styles.image} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Shirts</Text>
          <FlatList
            data={shirts}
            extraData={photos}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => "shirt_" + index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                {renderDelete(item.last_modified)}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ClothingItem", { item });
                  }}
                >
                  <Image source={{ uri: item.url }} style={styles.image} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Pants / Shorts
          </Text>
          <FlatList
            data={pants}
            extraData={photos}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => "pants_" + index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                {renderDelete(item.last_modified)}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ClothingItem", { item });
                  }}
                >
                  <Image source={{ uri: item.url }} style={styles.image} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Shoes</Text>
          <FlatList
            data={shoes}
            extraData={photos}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => "shoes_" + index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                {renderDelete(item.last_modified)}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ClothingItem", { item });
                  }}
                >
                  <Image source={{ uri: item.url }} style={styles.image} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Accessories</Text>
          <FlatList
            data={accessories}
            extraData={photos}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => "accessories" + index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                {renderDelete(item.last_modified)}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ClothingItem", { item });
                  }}
                >
                  <Image source={{ uri: item.url }} style={styles.image} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainHeader: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
    marginVertical: 10,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    marginVertical: 10,
    borderRadius: 15,
  },
  imageContainer: {
    //width: '300%',
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    margin: 10,
    borderRadius: 15,
  },
});

export default ClosetUI;
