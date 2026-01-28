/**
 * Blockchain configuration for Celo network
 * Supports both Alfajores testnet (development) and Mainnet (production)
 */

import { celoAlfajores, celo } from 'viem/chains'
import { Chain } from 'viem'

// Network configuration based on environment
export const CELO_NETWORK = (process.env.NEXT_PUBLIC_CELO_NETWORK || 'alfajores') as 'alfajores' | 'mainnet'

// Celo chains
export const CHAINS: Record<string, Chain> = {
  alfajores: celoAlfajores,
  mainnet: celo,
}

export const currentChain = CHAINS[CELO_NETWORK]

// cUSD token contract addresses
export const CUSD_ADDRESSES: Record<string, `0x${string}`> = {
  // Celo Alfajores testnet
  alfajores: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
  // Celo Mainnet
  mainnet: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
}

export const CUSD_ADDRESS = CUSD_ADDRESSES[CELO_NETWORK]

// cUSD has 18 decimals (same as ETH)
export const CUSD_DECIMALS = 18

// Block explorer URLs
export const BLOCK_EXPLORERS: Record<string, string> = {
  alfajores: 'https://alfajores.celoscan.io',
  mainnet: 'https://celoscan.io',
}

export const BLOCK_EXPLORER_URL = BLOCK_EXPLORERS[CELO_NETWORK]

// Network configurations
export const NETWORK_CONFIG = {
  alfajores: {
    name: 'Celo Alfajores Testnet',
    rpcUrl: 'https://alfajores-forno.celo-testnet.org',
    chainId: 44787,
    blockTime: 5, // Average block time in seconds
    confirmations: 1, // Number of confirmations to wait
  },
  mainnet: {
    name: 'Celo Mainnet',
    rpcUrl: 'https://forno.celo.org',
    chainId: 42220,
    blockTime: 5,
    confirmations: 2,
  },
}

export const currentNetworkConfig = NETWORK_CONFIG[CELO_NETWORK]

// Validation
if (!CUSD_ADDRESS) {
  throw new Error(`cUSD address not configured for network: ${CELO_NETWORK}`)
}
