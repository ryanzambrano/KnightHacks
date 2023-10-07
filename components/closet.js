import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
} from "react-native";
import { supabase } from "./auth/supabase";
const ClosetUI = ({ route }) => {
  const { session } = route.params;
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
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

        // Construct the URLs based on the fetched last_modified dates
        const photoUrls = data.map(
          (image) =>
            `${base_url}/${session.user.id}/${session.user.id}-${image.last_modified}`
        );

        setPhotos(photoUrls);
        console.log(photoUrls[1]);
      } else {
        console.error("Failed to fetch image metadata from database:", error);
      }
    };
    fetchPhotoTimestampsFromDatabase();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.mainHeader}>My Closet</Text>
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.image}
            onError={(error) => console.log("Error loading image:", error)}
          />
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
