import { StatusBar } from 'expo-status-bar';
import { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Audio } from "expo-av";
import {
  TranscribeOptions,
  TranscribeRealtimeOptions,
  WhisperContext,
  initWhisper,
} from "whisper.rn";

export default function App() {
  const whisper = useRef<WhisperContext>();
  const [isModelInitialized, setIsModelInitialized] = useState(false);

  const [realtimeText, setRealtimeText] = useState("");

  const loadModelFromAssets = useCallback(async() => {
    whisper.current = await initWhisper({
      filePath: require("./assets/whisper/ggml-tiny.bin"),
      // coreMLModelAsset: getCoreModelAsset(),
    });
  }, [])

  useEffect(() => {
    const init = async () => {
      if (!isModelInitialized) {
        await loadModelFromAssets();
        //await loadModelFromUri(); //UNCOMMENT THIS TO LOAD FROM URI
        setIsModelInitialized(true);
      }
    };
    init();
  }, [isModelInitialized, loadModelFromAssets]);


  async function startRealtimeTranscribe() {
    await Audio.requestPermissionsAsync();

    const realtimeOptions: TranscribeRealtimeOptions = {
      language: "en",
      realtimeAudioSec: 60,
      realtimeAudioSliceSec: 20,
      maxThreads: 6,
    };

    const { stop, subscribe } = await whisper.current!.transcribeRealtime(
      realtimeOptions
    );

    // realTimeStopCallback.current = stop;
    // setIsRealtimeTranscribing(true);

    subscribe((evt) => {
      const { isCapturing, data, processTime, recordingTime } = evt;

      console.log(
        `
          Realtime transcribing: ${isCapturing ? "ON" : "OFF"}
          Result: ${data?.result}
          Process time: ${processTime}ms
          Recording time: ${recordingTime}ms
        `
      );

      setRealtimeText(data?.result ?? "");
      if (!isCapturing) console.log("Finished realtime transcribing");
    });
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TouchableOpacity
        onPress={startRealtimeTranscribe}
      ><Text>Start transcribe</Text></TouchableOpacity>
      <Text>{realtimeText}</Text>
      <Text>working</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
