import { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
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

const FAIL_TRANSCRIPTION_CHUNK: TranscriptionChunk = {
  text: '< NO_TRANSCRIPTION_AVAILABLE >',
  processTime: 0,
};

const realtimeOptions: TranscribeRealtimeOptions = {
  language: 'en',
  realtimeAudioSec: 10,
  realtimeAudioSliceSec: 20,
  maxThreads: 6,
  // useVad: true,
};

type TranscriptionChunk = {
  text: string;
  processTime: number;
};

const App = () => {
  const whisper = useRef<WhisperContext>();
  const realTimeStopCallback = useRef<() => Promise<void>>();
  const [isModelInitialized, setIsModelInitialized] = useState(false);
  const [isRealTimeTranscribing, setIsRealTimeTranscribing] = useState(false);
  const [transcriptionSlices, setTranscriptionSlices] = useState<
    TranscriptionChunk[]
  >([]);

  useEffect(() => {
    (async () => {
      if (!isModelInitialized) {
        whisper.current = await initWhisper({
          filePath: require('./assets/whisper/ggml-tiny.bin'),
        });

        setIsModelInitialized(true);
      }
    })();
  }, [isModelInitialized]);

  const startRealTimeTranscribe = async () => {
    await Audio.requestPermissionsAsync();

    if (!whisper.current) {
      console.error('Whisper.rn not initialized');

      return;
    }

    const { stop, subscribe } =
      await whisper.current.transcribeRealtime(realtimeOptions);

    realTimeStopCallback.current = stop;
    setIsRealTimeTranscribing(true);

    subscribe(({ isCapturing, data, processTime, recordingTime, slices }) => {
      console.log(
        `
          Realtime transcribing: ${isCapturing ? 'ON' : 'OFF'}
          Result: ${data?.result}
          Process time: ${processTime}ms
          Recording time: ${recordingTime}ms
        `,
      );

      // TODO
      const results = slices
        ?.map(
          ({ data }) =>
            data?.segments.map(({ text, t0, t1 }) => ({
              text,
              processTime: t1 - t0,
            })) || [FAIL_TRANSCRIPTION_CHUNK],
        )
        .flat();

      setTranscriptionSlices(results || []);
    });
  };

  const stopRealTimeTranscribe = () => {
    realTimeStopCallback.current?.();
    setIsRealTimeTranscribing(false);
  };

  return (
    <SafeAreaView>
      <StatusBar style='auto' />
      <View style={styles.container}>
        <View style={styles.content}>
          {isModelInitialized ? (
            <>
              <Text style={styles.title}>Whisper AI</Text>
              <ScrollView
                contentContainerStyle={{
                  justifyContent: 'flex-start',
                  gap: 20,
                }}
              >
                {transcriptionSlices.map(({ text, processTime }) => (
                  <View
                    key={`${text}-${processTime}`}
                    style={styles.transcription}
                  >
                    <Text>{`Chunk: ${text}`}</Text>
                    <Text>{`Process time: ${processTime / 100}s`}</Text>
                  </View>
                ))}
              </ScrollView>
              <Pressable
                onPress={
                  isRealTimeTranscribing
                    ? stopRealTimeTranscribe
                    : startRealTimeTranscribe
                }
                style={styles.pressable}
              >
                <MaterialCommunityIcons
                  name={
                    isRealTimeTranscribing
                      ? 'stop-circle-outline'
                      : 'record-circle'
                  }
                  size={60}
                  color='red'
                />
              </Pressable>
            </>
          ) : (
            <Text>Initializing model...</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;
