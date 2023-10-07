import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';

const MessagingUI = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [translatedResponse, setTranslatedResponse] = useState('');
  const apiKey = ''; // Replace with your actual API key

  const translateText = async (textToTranslate) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-003/completions',
        {
          prompt: textToTranslate,
          max_tokens: 100,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
  
      // Extract the translated text from the response
      const translated = response.data.choices[0].text.trimStart();
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}></View>
      <View style={styles.messagesContainer}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.user ? styles.userMessage : styles.translatedMessage, // Apply different styles based on whether it's a user message or a translated message
              ]}
            >
              <Text style={styles.message}>{item.text}</Text>
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
          onChangeText={(text) => setMessage(text)}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <Button title="Send" onPress={sendMessage} color="#007AFF" />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F9F9F9',
    marginBottom: 10,
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
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '70%', // Limit the width of message containers
  },
  userMessage: {
    backgroundColor: '#dedede',
    alignSelf: 'flex-end',
  },
  translatedMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-start',
  },
  message: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    marginRight: 10,
    color: '#333',
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
});

export default MessagingUI;