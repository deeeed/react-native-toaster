import type { TextStyle } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

type ToastType = 'info' | 'normal' | 'success' | 'warning' | 'error';
type ToastPosition = 'top' | 'bottom' | 'middle';

export interface ToastParams {
  /** The message to show */
  message: string;
  subMessage?: string;
  /** Type of toast */
  type: ToastType;
  /**  Position of the toast */
  position: ToastPosition;
  /** Toast duration */
  duration: number;
  /** Toast Visibility */
  visibility: boolean;
  /** Toast Icon visibility */
  iconVisible: boolean;
  /** Toast Action onPress */
  action?: () => void;
  /** Toast Action Label */
  actionLabel: string;
  /** Toast Message Style */
  messageStyle: StyleProp<ViewStyle>;
  subMessageStyle: StyleProp<TextStyle>;
  /** icon style */
  iconStyle: StyleProp<TextStyle>;
  /** Toast Message Container Style */
  messageContainerStyle: StyleProp<ViewStyle>;
  /** Toast Snackbar Style */
  snackbarStyle: StyleProp<ViewStyle>;
}

/** All params are optional */
export type ToastOptions = Partial<ToastParams>;

export interface ToastMethods {
  /** Show a new toast */
  show(options: ToastOptions): void;
  /** Hide toast that are on display */
  hide(): void;
}

export interface ToastProviderProps {
  /**
   *  Override default values.
   * ```tsx
   * <ToastProvider overrides={{ position: 'top' }}>
   *   <Application />
   * </ToastProvider>
   * ```
   */
  overrides?: ToastOptions;
  children: JSX.Element;
}

export enum ToastActionType {
  SHOW = 'SHOW',
  HYDRATE = 'HYDRATE',
  HIDE = 'HIDE',
}

export interface ToastAction {
  type: ToastActionType;
  payload?: ToastOptions;
}

export type ToastIconType = {
  [key in ToastType]: string;
};

export type ToastStyles<P> = {
  [key in ToastType]: StyleProp<P>;
};
