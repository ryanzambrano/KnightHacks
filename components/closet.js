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
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const ClosetUI = ({ route, navigation }) => {
  const { session } = route.params;
  const [photos, setPhotos] = useState([]);

  const isFocused = useIsFocused();

  const [hats, setHats] = useState([]);
  const [shirts, setShirts] = useState([]);
  const [pants, setPants] = useState([]);
  const [shoes, setShoes] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [suits, setSuits] = useState([]);
  const [jackets, setJackets] = useState([]);
  

  const [isHatsVisible, setIsHatsVisible] = useState(true);
  const [isJacketsVisible, setIsJacketsVisible] = useState(true);
  const [isShirtsVisible, setIsShirtsVisible] = useState(true);
  const [isPantsVisible, setIsPantsVisible] = useState(true);
  const [isShoesVisible, setIsShoesVisible] = useState(true);
  const [isAccessoriesVisible, setIsAccessoriesVisible] = useState(true);
  const [isSuitsVisible, setIsSuitsVisible] = useState(true);

  const CategoryHeader = ({ title, isVisible, toggleVisibility }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
      }}
      onPress={toggleVisibility}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "white",
          flex: 1,
        }}
      >
        {title}
      </Text>
      <Text style={{ fontSize: 40, color: "white" }}>
        {isVisible ? "▾" : "▸"}
      </Text>
    </TouchableOpacity>
  );

  const EmptyListComponent = () => (
    <View style={styles.emptyListContainer}>
      <Text style={styles.emptyListText}>Nothing to see here...</Text>
    </View>
  );

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
      const jacketsData = enrichedData.filter(
        (photo) => photo.clothing_type === "jacket / sweater"
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
        (photo) => photo.clothing_type === "accessory"
      );
      const suitsData = enrichedData.filter(
        (photo) => photo.clothing_type === "suit / dress"
      );

      setHats(hatsData);
      setJackets(jacketsData);
      setShirts(shirtsData);
      setPants(pantsData);
      setShoes(shoesData);
      setAccessories(accessoriesData);
      setSuits(suitsData);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.mainHeader}>My Closet</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <CategoryHeader
          title="Hats"
          isVisible={isHatsVisible}
          toggleVisibility={() => setIsHatsVisible((prev) => !prev)}
        />
        {isHatsVisible && (
          <View>
            <FlatList
              data={hats}
              ListEmptyComponent={EmptyListComponent}
              extraData={photos}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => "hat_" + index.toString()}
              renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("ClothingItem", { item });
                    }}
                  >
                    <Image source={{ uri: item.url }} style={styles.image} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "white",
                      paddingVertical: 5,
                    }}
                  >
                    "{item.name}"
                  </Text>
                </View>
              )}
            />
          </View>
        )}

        <CategoryHeader
          title="Jackets / Sweaters"
          isVisible={isJacketsVisible}
          toggleVisibility={() => setIsJacketsVisible((prev) => !prev)}
        />
        {isJacketsVisible && (
          <View>
            <FlatList
              data={jackets}
              ListEmptyComponent={EmptyListComponent}
              extraData={photos}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => "jackets_" + index.toString()}
              renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("ClothingItem", { item });
                    }}
                  >
                    <Image source={{ uri: item.url }} style={styles.image} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "white",
                      paddingVertical: 5,
                    }}
                  >
                    "{item.name}"
                  </Text>
                </View>
              )}
            />
          </View>
        )}

        <CategoryHeader
          title="Shirts"
          isVisible={isShirtsVisible}
          toggleVisibility={() => setIsShirtsVisible((prev) => !prev)}
        />
        {isShirtsVisible && (
          <View>
            <FlatList
              data={shirts}
              ListEmptyComponent={EmptyListComponent}
              extraData={photos}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => "shirt_" + index.toString()}
              renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("ClothingItem", { item });
                    }}
                  >
                    <Image source={{ uri: item.url }} style={styles.image} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "white",
                      paddingVertical: 5,
                    }}
                  >
                    "{item.name}"
                  </Text>
                </View>
              )}
            />
          </View>
        )}

        <CategoryHeader
          title="Pants / Shorts"
          isVisible={isPantsVisible}
          toggleVisibility={() => setIsPantsVisible((prev) => !prev)}
        />
        {isPantsVisible && (
          <View>
            <FlatList
              data={pants}
              ListEmptyComponent={EmptyListComponent}
              extraData={photos}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => "pants_" + index.toString()}
              renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("ClothingItem", { item });
                    }}
                  >
                    <Image source={{ uri: item.url }} style={styles.image} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "white",
                      paddingVertical: 15,
                    }}
                  >
                    "{item.name}"
                  </Text>
                </View>
              )}
            />
          </View>
        )}

        <CategoryHeader
          title="Shoes"
          isVisible={isShoesVisible}
          toggleVisibility={() => setIsShoesVisible((prev) => !prev)}
        />
        {isShoesVisible && (
          <View>
            <FlatList
              data={shoes}
              ListEmptyComponent={EmptyListComponent}
              extraData={photos}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => "shoes_" + index.toString()}
              renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("ClothingItem", { item });
                    }}
                  >
                    <Image source={{ uri: item.url }} style={styles.image} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "white",
                      paddingVertical: 5,
                    }}
                  >
                    "{item.name}"
                  </Text>
                </View>
              )}
            />
          </View>
        )}

<CategoryHeader
          title="Suits / Dresses"
          isVisible={isSuitsVisible}
          toggleVisibility={() => setIsSuitsVisible((prev) => !prev)}
        />
        {isSuitsVisible && (
          <View>
            <FlatList
              data={suits}
              ListEmptyComponent={EmptyListComponent}
              extraData={photos}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => "suits_" + index.toString()}
              renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("ClothingItem", { item });
                    }}
                  >
                    <Image source={{ uri: item.url }} style={styles.image} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "white",
                      paddingVertical: 5,
                    }}
                  >
                    "{item.name}"
                  </Text>
                </View>
              )}
            />
          </View>
        )}
        <CategoryHeader
          title="Accessories"
          isVisible={isAccessoriesVisible}
          toggleVisibility={() => setIsAccessoriesVisible((prev) => !prev)}
        />
        {isAccessoriesVisible && (
          <View>
            <FlatList
              data={accessories}
              ListEmptyComponent={EmptyListComponent}
              extraData={photos}
              paddingBottom={100}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => "accessories_" + index.toString()}
              renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("ClothingItem", { item });
                    }}
                  >
                    <Image source={{ uri: item.url }} style={styles.image} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "white",
                      paddingVertical: 5,
                    }}
                  >
                    "{item.name}"
                  </Text>
                </View>
              )}
            />

            <View>
              
            </View>
          </View>
        )}
        
        {!isAccessoriesVisible && <View style={{ height: 100 }}></View>}
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1D1D20",
  },
  mainHeader: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 20,
    marginTop: 5,
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
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 5,
    backgroundColor: "#2B2D2F",
  },
  emptyListContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  emptyListText: {
    color: "lightgrey",
    fontSize: 16,
  },
});

export default ClosetUI;
