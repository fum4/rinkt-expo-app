import { StatusBar } from 'expo-status-bar';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { Foundation } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import {
  TranscribeRealtimeOptions,
  WhisperContext,
  initWhisper,
} from 'whisper.rn';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    gap: 20,
  },
  transcription: {
    paddingHorizontal: 20,
  },
  pressable: {
    flexDirection: 'row',
    gap: 8,
  },
});

const realtimeOptions: TranscribeRealtimeOptions = {
  language: 'en',
  realtimeAudioSec: 60,
  realtimeAudioSliceSec: 20,
  maxThreads: 6,
  useVad: true,
};

const App = () => {
  const whisper = useRef<WhisperContext>();
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [realtimeText, setRealtimeText] = useState('');

  const loadModelFromAssets = useCallback(async () => {
    whisper.current = await initWhisper({
      filePath: require('./assets/whisper/ggml-tiny.bin'),
    });
  }, []);

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

    const { stop, subscribe } =
      await whisper.current.transcribeRealtime(realtimeOptions);

    subscribe(({ isCapturing, data, processTime, recordingTime }) => {
      console.log(
        `
          Realtime transcribing: ${isCapturing ? 'ON' : 'OFF'}
          Result: ${data?.result}
          Process time: ${processTime}ms
          Recording time: ${recordingTime}ms
        `,
      );

      setIsCapturing(isCapturing);
      setRealtimeText(data?.result ?? '');
    });
  };

  return (
    <SafeAreaView>
      <StatusBar style='auto' />
      {isModelInitialized ? (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Speech to Text</Text>
            <ScrollView>
              <Text>{realtimeText}</Text>
              <Text style={styles.transcription}>
                asdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasd
                asdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasd
                asdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasd
                asdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasd
                asdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasd
                asdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasd
                asdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasd
                asdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasdasdadasdasdasd
              </Text>
            </ScrollView>
            <Pressable
              onPress={startRealtimeTranscribe}
              style={styles.pressable}
            >
              <Foundation
                name='record'
                size={60}
                color={isCapturing ? 'grey' : 'red'}
              />
            </Pressable>
          </View>
        </View>
      ) : (
        <Text>Initializing model...</Text>
      )}
    </SafeAreaView>
  );
};

export default App;
