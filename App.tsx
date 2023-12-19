import { StatusBar } from 'expo-status-bar';
import { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import {
  TranscribeRealtimeOptions,
  WhisperContext,
  initWhisper,
} from 'whisper.rn';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const realtimeOptions: TranscribeRealtimeOptions = {
  language: 'en',
  realtimeAudioSec: 60,
  realtimeAudioSliceSec: 20,
  maxThreads: 6,
};

const App = () => {
  const whisper = useRef<WhisperContext>();
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  const [realtimeText, setRealtimeText] = useState("");

  const loadModelFromAssets = useCallback(async() => {
    whisper.current = await initWhisper({
      filePath: require('./assets/whisper/ggml-tiny.bin'),
    });
  }, [])

  useEffect(() => {
    const initializeModel = async () => {
      if (!isModelInitialized) {
        await loadModelFromAssets();
        setIsModelInitialized(true);
      }
    };

    initializeModel();
  }, [isModelInitialized, loadModelFromAssets]);


  const startRealtimeTranscribe = async () => {
    await Audio.requestPermissionsAsync();

    if (!whisper.current) {
      console.error('Whisper.rn not initialized');

      return;
    }

    const { stop, subscribe } = await whisper.current.transcribeRealtime(
      realtimeOptions
    );

    subscribe(({ isCapturing, data, processTime, recordingTime }) => {
      console.log(
        `
          Realtime transcribing: ${isCapturing ? 'ON' : 'OFF'}
          Result: ${data?.result}
          Process time: ${processTime}ms
          Recording time: ${recordingTime}ms
        `
      );

      setRealtimeText(data?.result ?? "");
    });
  }

  return isModelInitialized ? (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <TouchableOpacity onPress={startRealtimeTranscribe}>
        <Text>Start recording</Text>
      </TouchableOpacity>
      <Text>{realtimeText}</Text>
    </View>
  ) : (
    <Text>Initializing model...</Text>
  );
}

export default App;
