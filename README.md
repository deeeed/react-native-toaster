# react-native-toaster

Simple Toast library

## Installation

```sh
yarn add @siteed/react-native-toaster
```

## Usage

```js
import { ToastProvider, useToast } from '@siteed/react-native-toaster';
import { Button } from 'react-native-paper';

const App = () => {
  const toaster = useToast();

  return (
    <View>
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
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
