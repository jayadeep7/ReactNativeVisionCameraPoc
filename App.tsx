/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  DBRConfig,
  decode,
  TextResult,
} from 'vision-camera-dynamsoft-barcode-reader';
import * as REA from 'react-native-reanimated';
import BarcodeMask from 'react-native-barcode-mask';
import Database from './src/DatabaseHelper';

const App = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [barcodeResults, setBarcodeResults] = useState([] as TextResult[]);
  const devices = useCameraDevices();
  const device = devices.back;
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const config: DBRConfig = {};
    // config.template =
    //   '{"ImageParameter":{"BarcodeFormatIds":["BF_QR_CODE","BF_DATA_MATRIX"],"Description":"","Name":"Settings"},"Version":"3.0"}'; //scan qrcode only
    console.log('frame result', frame);
    console.log('frame string', frame.close(), frame.toString());
    const results: TextResult[] = decode(frame, config);
    console.log('barcode result', results);
    REA.runOnJS(setBarcodeResults)(results);
  }, []);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');

      let task1, task2;
      Database.sharedDb.realmInstance.write(() => {
        // write function for realm
        task1 = Database.sharedDb.realmInstance.create('Task', {
          _id: 1,
          name: 'go grocery shopping',
          status: 'Open',
        });
        task2 = Database.sharedDb.realmInstance.create('Task', {
          _id: 2,
          name: 'go exercise',
          status: 'Open',
        });
        console.log(`created two tasks----1: ${task1.name} & ${task2.name}`);
      });
    })();
  }, []);

  return (
    <View style={{flex: 1}}>
      {device != null && hasPermission && (
        <>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}></Camera>
          <BarcodeMask
            edgeColor={`#fff`}
            animatedLineColor={`#fff`}
            showAnimatedLine={true}
            width={250}
            height={250}
            edgeBorderWidth={3}
            outerMaskOpacity={0.8}
            onLayoutMeasured={async e => {
              e.nativeEvent.target = await 1000;
              e.nativeEvent.layout.width = await 1000;
              e.nativeEvent.layout.height = await 1000;
              e.nativeEvent.layout.x = await 1000;
              e.nativeEvent.layout.y = await 1000;
            }}
            lineAnimationDuration={2000}
          />
        </>
      )}
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   barcodeText: {
//     fontSize: 20,
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

export default App;
