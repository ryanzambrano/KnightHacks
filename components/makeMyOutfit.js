import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
} from "react-native";
import axios from "axios";
import OpenAI from "openai";
import { supabase } from "./auth/supabase";
import LoadingDots from "react-native-loading-dots";

const MakeMyOutfitUI = ({ route }) => {
  const { session } = route.params;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [inputText, setInputText] = useState("");
  const [translatedResponse, setTranslatedResponse] = useState("");
  const [wardrobeString, setWardrobeString] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoUrls, setPhotoUrls] = useState(null);
  const flatListRef = useRef(null);
  

  const renderLoadingDots = () => {
    if (loading && messages.length > 0 && messages[messages.length - 1].user) {
      return (
        <View style={styles.loadingDots}>
          <LoadingDots size={8} colors={["grey", "gold", "grey", "gold"]} />
          <Text style={{marginTop: 50, color: 'white', fontWeight: 'bold'}}>Generating...</Text>
        </View>

      );
    }
    return null;
  };

  
  const apiKey = ''; // Replace with your actual API key
  const openai = new OpenAI({
    apiKey,
  });

  const fetchwardrobe = async () => {
    const id = session.user.id;

    const { data, error } = await supabase
      .from("user_images")
      .select(
        "color, setting, material, fit, clothing_type, name, user_id, url"
      )
      .eq("user_id", id);

    if (error) {
      console.error("Error fetching user images:", error.message);
      // Handle the error
    } else {
      // 'data' contains the selected rows
      const newWardrobeString = data
        .map((item) => {
          return `Color: ${item.color}, Setting: ${item.setting}, Material: ${item.material}, Fit: ${item.fit}, Clothing Type: ${item.clothing_type}, Name: ${item.name}, URL: ${item.url}`;
        })
        .join("\n");

      setWardrobeString(newWardrobeString);
      //console.log(wardrobeString);

      //console.log('Wardrobe as a single string:', wardrobeString);
      // Use 'data' in your application
    }
  };

  useEffect(() => {
    // This code will run when the component mounts
    fetchwardrobe();
  }, []);

  const chatbot = async (message) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a stylist who needs to help me a male decide on one outfit. To decide on the outfit you should do it in this hierarchy: socially acceptable, then color theory. It has to be clothes in their wardrobe do not mention clothes that are not in their wardrobe. If you think that there is nothing in this person's wardrobe that is acceptable for the event they are attending you should mention that based on what is in their wardrobe. If you think they would like an outfit that is not socially acceptable for said event you should mention that type of outfit isn't socially acceptable for said event but give them an outfit with their wardrobe. It should be outputted in this exact format so don't say anything before saying which outfit it is going to be: \n\"\nOutfit: \nTop:\n Your x (name), \nBottom: \nYour x(name), \nShoes: \nYour x(name)\nHats and/or accessories\nYour x(name)\n\" If the user mentions where they are going tell them to enjoy said event. If they don't mention where they are going just say \n\"Enjoy your new drip!\". Give me the URLs with the respective items at the bottom of the response in the order of hat, top, bottom, shoes, and accessories in a comma-separated format like this: urlx,urly,urlz. No need to mention which one is which just give me the URLs in a comma-separated sentence.\n",
          },
          {
            role: "user",
            content: wardrobeString,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 1,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      const gpt = response.choices[0].message.content; // Check if content is the right property

      const urls = Array.from(gpt.matchAll(/https?:\/\/\S+/g), (m) => m[0]);

      const input = gpt;

      const pattern = /https.{173}/g;

      const extractedUrls = input.match(pattern);

      setPhotoUrls(extractedUrls);

      let cleanedText = gpt;

      if (urls.length > 0) {
        const indexOfFirstUrl = gpt.indexOf(urls[0]);
        cleanedText = gpt.substring(0, indexOfFirstUrl).trim();
      }

      //console.log("cleaned text:", cleanedText);
      console.log("\nExtracted URLs:", urls);

      console.log(photoUrls);

      setTranslatedResponse(cleanedText);

      return `${cleanedText}`;
    } catch (error) {
      console.error("Error translating text:", error);
      throw error; // Rethrow the error for handling in sendMessage
    }
  };

  const sendMessage = async () => {
    if (message.trim() !== "") {
      // Set the user's message immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, user: true },
      ]);
      setMessage("");
      flatListRef.current?.scrollToEnd({ animated: true });

      setLoading(true);
      // Always call the translation function
      try {
        const chatbotResponse = await chatbot(message);
        console.log("chat response", chatbotResponse);
        setLoading(false);
        // Update the translated message in the state
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: chatbotResponse, user: false },
        ]);
      } catch (error) {
        console.error("Error translating text:", error);
        setLoading(false);
      }
    }
  };
  const RenderPhotos = () => {
    if (!photoUrls || photoUrls.length === 0) {
      return null;
    }
    const cleanedPhotoUrls = photoUrls.map((url) => url.replace(/[,.]$/, ""));

    console.log(photoUrls);
  }
  
  const promptIdeas = [
    "Give me an outfit for the movies?",
    "What's a good outfit for an emo-themed party?",
    "I'm going to the beach, what should I wear?",
    "I need a outfit for a wedding, what do I wear?",
    "Suggest an outfit for a first date at a casual cafe.",
    "I need a look for a beach party this weekend.",
    "What should I wear to a formal business meeting?",
    "Recommend an outfit for a winter wedding.",
    "What's the best attire for a summer music festival?",
    "Help me choose clothes for a hike in the mountains.",
    "I'm attending a retro '80s party. What should I wear?",
    "Can you suggest a comfortable yet stylish airport look?",
    "I'm going for a yoga class. What outfit do you recommend?",
    "What's a trendy outfit for a day of shopping in the city?",
    "Help me pick an attire for a charity gala.",
    "Recommend a look for a brunch with friends.",
    "I'm going to a book launch event. What should I wear?",
    "Suggest a sporty look for a day at the racetrack.",
    "I'm attending a Broadway show tonight. What's the best outfit?",
    "What's a cozy outfit for a rainy day indoors?",
    "Recommend a stylish look for a visit to an art gallery.",
    "I'm going for a picnic in the park. What should I wear?",
    "Can you suggest an attire for a night out at a jazz club?",
    "Help me pick a look for a family barbecue.",
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentPrompt(prev => (prev + 1) % promptIdeas.length);
    }, 3000);
    return () => clearInterval(interval);
}, []);

const renderEmptyList = () => {
    return (
        <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>Need inspiration? Try asking:</Text>
            <Text style={styles.suggestionText}>{promptIdeas[currentPrompt]}</Text>
        </View>
    );
};
  

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#1D1D20", marginBottom: 80,}}>
      <View style={styles.header}>
    <Text style={styles.headerText}>Build an Outfit</Text>
      </View>

    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={styles.header}></View>
      <View style={styles.messagesContainer}>
    
      <FlatList
        data={messages}
        ref={flatListRef}
        ListEmptyComponent={renderEmptyList}
        renderItem={({ item, index }) => (
          <View
          
            style={[
              styles.messageContainer,
              item.user ? styles.userMessage : styles.translatedMessage,
              
            ]}
          >
            
            <Text style={styles.message}>
              {item.user ? item.text : item.text.content}
            </Text>
            
          </View>
          
        )}
        ListFooterComponent={renderLoadingDots}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.messagesContent}
        
      />
       
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          marginBottom={0}
          keyboardAppearance='dark'
          onChangeText={(text) => setMessage(text)}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <Button title="Send" onPress={sendMessage} color="#cd9625" />
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#1D1D20',
    marginBottom: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  headerText: {
    fontSize: 20,  
    fontWeight: 'bold',
    color: 'white',
},

  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingTop: 10,
    paddingBottom: 20,
    color: 'white',
  },
  messageContainer: {
    borderRadius: 20,
    paddingVertical: 10,
    padding: 15,
    marginBottom: 15,

    maxWidth: "70%", // Limit the width of message containers
  },
  userMessage: {
    backgroundColor: "white",
    alignSelf: "flex-end",
  },
  translatedMessage: {
    backgroundColor: "#cd9625",
    alignSelf: "flex-start",
  },
  message: {
    fontSize: 16,
    
    color: '#000',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2B2D2F",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    marginRight: 10,
    color: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#2B2D2F",
  },
  loadingDots: {
    marginLeft: 10, // provide some left spacing
    alignSelf: "flex-start",
    paddingBottom: 30,
  },
  emptyListContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  
  emptyListText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  
  suggestionText: {
    fontSize: 16,
    color: '#888',
    paddingHorizontal: 10,
    textAlign: 'center',
    marginBottom: 5,
  }
  //#cd9625
});
export default MakeMyOutfitUI;