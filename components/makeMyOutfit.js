import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, Text, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import axios from 'axios';
import OpenAI from "openai";
import { supabase } from "./auth/supabase";

const MakeMyOutfitUI = ({ route }) => {
  const { session } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [translatedResponse, setTranslatedResponse] = useState('');
  const [wardrobeString, setWardrobeString] = useState('');

  
  const apiKey = ''; // Replace with your actual API key
  const openai = new OpenAI({
    apiKey
  });

  const fetchwardrobe = async () => {

    const id = '81d94bc6-a308-41da-b22b-9765a916f4ff';

    const { data, error } = await supabase
    .from('user_images')
    .select('color, setting, material, fit, clothing_type, name')
    .eq('user_id', id);

  if (error) {
  console.error('Error fetching user images:', error.message);
  // Handle the error
}   else {
  // 'data' contains the selected rows
  const newWardrobeString = data.map(item => {
    return `${item.color}, ${item.setting}, ${item.material}, ${item.fit}, ${item.clothing_type}, ${item.name}`;
  }).join('\n');

  setWardrobeString(newWardrobeString)

  //console.log('Wardrobe as a single string:', wardrobeString);
  // Use 'data' in your application
}

  };

  useEffect(() => {
    // This code will run when the component mounts
    fetchwardrobe();
  }, []); 
  
  const translateText = async (message) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": "You are a stylist who needs to help me a male decide on one outfit. To decide on the outfit you should do it in this hierarchy: socially acceptable, then color theory. It has to be clothes in their wardrobe do not mention clothes that are not in their wardrobe. If you think that there is nothing in this person's wardrobe that is acceptable for the event they are attending you should mention that based on what is in their wardrobe. If you think they would like an outfit that is not socially acceptable for said event you should mention that type of outfit isn't socially acceptable for said event but give them an outfit with their wardrobe. It should be outputted in this exactly in this format so don't say anything before the outfit: \"\nOutfit: \nTop:\n Your x (name), \nBottom:  \nYour x(name), \nShoes: \nYour x(name)\nHats and/or accessories\nYour x(name)\n\" If the user mentions where they are going tell them to enjoy said event. If they don't mention where they are going just say \"enjoy your new drip!\""
          },
          {
            "role": "user",
            "content": wardrobeString
          },
          {
            "role": "user",
            "content": message
          }
        ],
        temperature: 1,
        max_tokens: 738,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      const translated = response.choices[0].message;
      setTranslatedResponse(translated);
      // console.log(response.data.choices[0].text.trimStart());
   
       return translated; // Return the translated text
     } catch (error) {
       console.error('Error translating text:', error);
       throw error; // Rethrow the error for handling in sendMessage
     }
   };

   const sendMessage = async () => {
    if (message.trim() !== '') {
      // Set the user's message immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, user: true },
      ]);
      setMessage('');
  
      // Always call the translation function
      try {
        const translatedText = await translateText(message);
        // Update the translated message in the state
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: translatedText, user: false },
        ]);
      } catch (error) {
        console.error('Error translating text:', error);
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#1D1D20", marginBottom: 80,}}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={styles.header}></View>
      <View style={styles.messagesContainer}>
      <FlatList
  data={messages}
  renderItem={({ item }) => (
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    borderRadius: 20,
    paddingVertical: 10,
    padding: 15,
    marginBottom: 15,
    
    maxWidth: '70%', // Limit the width of message containers
  },
  userMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-end',
  },
  translatedMessage: {
    backgroundColor: '#cd9625',
    alignSelf: 'flex-start',
  },
  message: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2B2D2F',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    marginRight: 10,
    color: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#2B2D2F",
  },

  //#cd9625
});
export default MakeMyOutfitUI;
