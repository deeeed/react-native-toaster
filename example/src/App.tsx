import * as React from 'react';

import { ToastProvider, useToast } from '@siteed/react-native-toaster';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const App = () => {
  const toaster = useToast();

  return (
    <View style={styles.container}>
      <Text>TODO</Text>
      <View>
        {/* <MaterialCommunityIcons name="camera" size={30} color="#900" /> */}

        <Button
          onPress={() => {
            toaster.show({
              message: 'Save Success',
              subMessage: 'Please check the application',
              type: 'success',
              actionLabel: 'OK',
              iconVisible: true,
              snackbarStyle: {
                // backgroundColor: 'red',
              },
              duration: 100000,
              action() {
                console.log('ok');
              },
            });
          }}
        >
          Success Toast
        </Button>
        <Button
          onPress={() => {
            toaster.show({
              message: 'This is a toast',
              type: 'info',
              actionLabel: 'OK',
              duration: 10000,
              action() {
                console.log('ok');
              },
            });
          }}
        >
          Info Toast
        </Button>
        <Button
          onPress={() => {
            toaster.show({
              message: 'This is a toast',
              type: 'warning',
              iconVisible: true,
            });
          }}
        >
          Warning Toast
        </Button>
        <Button
          onPress={() => {
            toaster.show({
              message: 'This is a toast',
              type: 'error',
              iconVisible: true,
              position: 'middle',
            });
          }}
        >
          Error Toast
        </Button>
      </View>
    </View>
  );
};

export default function WithToast() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
