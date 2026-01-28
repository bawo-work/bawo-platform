// Wallet Types for MiniPay Integration

export interface MiniPayProvider extends EthereumProvider {
  isMiniPay: boolean;
}

export interface EthereumProvider {
  request: (args: RequestArguments) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
}

export interface RequestArguments {
  method: string;
  params?: unknown[] | Record<string, unknown>;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isMiniPay: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface WalletDetectionResult {
  address: string | null;
  isMiniPay: boolean;
  error?: string;
}

declare global {
  interface Window {
    ethereum?: MiniPayProvider;
  }
}
