import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { supabase } from "./auth/supabase";
import Icon from "react-native-vector-icons/FontAwesome";

const ClosetUI = ({ route }) => {
  const { session } = route.params;
  const [photos, setPhotos] = useState([]);

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
      .select("last_modified")
      .eq("user_id", session.user.id);

    if (data) {
      const base_url =
        "https://vzdnrdsqkzwzihnqfong.supabase.co/storage/v1/object/public/user_pictures";

      const enrichedData = data.map((image) => ({
        ...image,
        url: `${base_url}/${session.user.id}/${session.user.id}-${image.last_modified}`,
      }));

      setPhotos(enrichedData); // Store the entire data array
    } else {
      console.error("Failed to fetch image metadata from database:", error);
    }
  };

  useEffect(() => {
    fetchPhotoTimestampsFromDatabase();
  }, []);

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
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.imageContainer}>
            {renderDelete(item.last_modified)}
            <Image
              source={{ uri: item.url }}
              style={styles.image}
              onError={(error) => console.log("Error loading image:", error)}
            />
          </View>
        )}
      />
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
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginVertical: 10,
  },
  // ... other styles
});

export default ClosetUI;
