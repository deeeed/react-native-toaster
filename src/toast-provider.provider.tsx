import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { Dimensions, Keyboard, Platform, StyleSheet, View } from 'react-native';

import type { StyleProp, ViewStyle } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type {
  ToastAction,
  ToastIconType,
  ToastMethods,
  ToastOptions,
  ToastParams,
  ToastProviderProps,
  ToastStyles,
} from './toast-provider.types';
import { ToastActionType } from './toast-provider.types';

const ToastContext = createContext<ToastMethods | null>(null);

const defaults: ToastParams = {
  message: '',
  type: 'normal',
  position: 'bottom',
  duration: 2000,
  visibility: false,
  action: undefined,
  actionLabel: 'DONE',
  iconVisible: false,
  messageStyle: {},
  messageContainerStyle: {},
  snackbarStyle: {},
};

const reducer = (state: ToastParams, action: ToastAction) => {
  switch (action.type) {
    case ToastActionType.SHOW:
      return { ...state, ...action.payload };

    case ToastActionType.HYDRATE:
      return { ...state, ...action.payload, visibility: false };

    case ToastActionType.HIDE:
      return { ...state, visibility: false };

    default:
      return state;
  }
};

/**
 * Wrap your component tree with ToastProvider. This should be after SafeAreaProvider & PaperProvider!
 * ## Usage
 * ```tsx
 * import React from 'react';
 * import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
 * import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
 * import { ToastProvider } from 'react-native-paper-toast';
 * import Application from './application';
 *
 * export default function App() {
 *   return (
 *     <SafeAreaProvider initialMetrics={initialWindowMetrics}>
 *       <PaperProvider theme={DefaultTheme}>
 *         <ToastProvider overrides={{ position: 'top' }}>
 *           <Application />
 *         </ToastProvider>
 *       </PaperProvider>
 *     </SafeAreaProvider>
 *   );
 * }
 * ```
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  overrides,
}) => {
  const initialState = useMemo(
    () => ({ ...defaults, ...overrides }),
    [overrides]
  );
  const [state, dispatch] = useReducer(reducer, initialState);

  const windowDimensions = Dimensions.get('window');
  const insets = useSafeAreaInsets();

  const toast = useMemo(
    () => ({
      show(options: ToastOptions) {
        const newState: ToastParams = {
          ...initialState,
          ...options,
          visibility: true,
        };
        newState.position === 'bottom' && Keyboard.dismiss();
        dispatch({ type: ToastActionType.SHOW, payload: newState });
      },
      hide() {
        dispatch({ type: ToastActionType.HIDE });
      },
    }),
    [initialState]
  );

  const computedStyle = useMemo(() => {
    const base = {
      position: Platform.OS === 'web' ? 'fixed' : 'absolute',
      left: insets.left,
      right: insets.right,
      width: undefined,
      alignItems: 'center',
      zIndex: 9999,
    } as any;
    let style: StyleProp<ViewStyle>;
    if (state.position === 'bottom') {
      style = {
        ...base,
        bottom: insets.bottom,
      };
      return style;
    }
    if (state.position === 'top') {
      style = {
        ...base,
        top: insets.top,
        bottom: undefined,
      };
      return style;
    }
    style = {
      ...base,
      top: insets.top,
      bottom: insets.bottom,
      justifyContent: 'center',
    };
    if (Platform.OS === 'web') {
      style = {
        ...styles,
        top: windowDimensions.height / 2 - 20, // Adjust as needed
        bottom: windowDimensions.height / 2 - 20, // Adjust as needed
      };
    }

    console.log(`computedStyle: ${JSON.stringify(style, null, 2)}`);
    return style;
  }, [insets, state.position, windowDimensions]);

  useEffect(() => {
    dispatch({ type: ToastActionType.HYDRATE, payload: initialState });
  }, [initialState]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Snackbar
        onDismiss={toast.hide}
        style={[types[state.type], state.snackbarStyle]}
        wrapperStyle={computedStyle}
        duration={state.duration}
        visible={state.visibility}
        action={
          state.action
            ? { label: state.actionLabel, onPress: state.action }
            : undefined
        }
      >
        <View
          style={[styles.defaultMessageContainer, state.messageContainerStyle]}
        >
          {state.iconVisible && (
            <MaterialCommunityIcons
              name={icons[state.type] as any}
              style={[styles.message, state.messageStyle]}
              size={20}
            />
          )}
          <Text
            style={[styles.message, state.messageStyle]}
          >{` ${state.message}`}</Text>
        </View>
      </Snackbar>
    </ToastContext.Provider>
  );
};

/**
 * useToast hook is used to show and hide Toast messages.
 * ## Usage
 * Import the `useToast` hook from the library. Calling it will return you an object with two functions `show` and `hide` to show or hide toast.
 *
 * ```tsx
 * import { useToast } from 'react-native-paper-toast';
 *
 * export const Screen: React.FC<Props> = (props) => {
 *   const toaster = useToast();
 *   // You can now toast methods from handler functions, effects or onPress props!
 *
 *   // Call from handler function
 *   const handleError = () =>
 *     toaster.show({ message: 'Invalid Username', type: 'error' });
 *
 *   // Call from Effects
 *   useEffect(() => {
 *     login(username, password).then((v) =>
 *       toaster.show({ message: 'Login successful', duration: 2000 })
 *     );
 *   });
 *
 *   return (
 *    <Surface>
 *      <Button onPress={() => toaster.show({ message: 'Here is a toast for ya!' })}>
 *        Show Toast
 *      </Button>
 *      <Button onPress={toaster.hide}>Hide Toast</Button>
 *    </Surface>
 *  );
 * };
 * ```
 */
export const useToast = () => {
  const toast = useContext(ToastContext);
  if (!toast) {
    throw new Error('useToast must be used within a ToastProvider.');
  }
  return toast;
};

const icons: ToastIconType = {
  normal: 'information-outline',
  info: 'information-outline',
  warning: 'alert-circle-outline',
  success: 'check-circle-outline',
  error: 'close-circle-outline',
};

const common: ViewStyle = {
  borderRadius: 3,
  width: '95%',
  maxWidth: 400,
};

const types: ToastStyles = {
  info: {
    ...common,
    backgroundColor: 'rgba(81,98,188,0.9)',
  },
  normal: {
    ...common,
    backgroundColor: 'rgba(72,77,81,0.9)',
  },
  success: {
    ...common,
    backgroundColor: 'rgba(75,153,79,0.9)',
  },
  warning: {
    ...common,
    backgroundColor: 'rgba(254,177,25,0.9)',
  },
  error: {
    ...common,
    backgroundColor: 'rgba(216,25,25,0.9)',
  },
};

const styles = StyleSheet.create({
  message: {
    color: 'white',
  },
  defaultMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
