/**
 * Celo blockchain client configuration
 * Uses viem for Ethereum/Celo interactions
 */

import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { currentChain, CELO_NETWORK } from './config'

// Platform wallet private key (from environment)
const PLATFORM_PRIVATE_KEY = process.env.PLATFORM_WALLET_PRIVATE_KEY as `0x${string}`

if (!PLATFORM_PRIVATE_KEY && typeof window === 'undefined') {
  console.warn('PLATFORM_WALLET_PRIVATE_KEY not set - payment operations will fail')
}

/**
 * Public client for reading blockchain data
 * Can be used on both client and server
 */
export const publicClient = createPublicClient({
  chain: currentChain,
  transport: http(),
})

/**
 * Platform wallet client for sending transactions
 * Server-side only - has access to private key
 */
export function createPlatformWallet() {
  if (!PLATFORM_PRIVATE_KEY) {
    throw new Error('PLATFORM_WALLET_PRIVATE_KEY is required for payment operations')
  }

  const account = privateKeyToAccount(PLATFORM_PRIVATE_KEY)

  return createWalletClient({
    account,
    chain: currentChain,
    transport: http(),
  })
}

/**
 * Get platform wallet address
 */
export function getPlatformWalletAddress(): string {
  if (!PLATFORM_PRIVATE_KEY) {
    throw new Error('PLATFORM_WALLET_PRIVATE_KEY not set')
  }

  const account = privateKeyToAccount(PLATFORM_PRIVATE_KEY)
  return account.address
}

/**
 * Verify Celo network connection
 */
export async function verifyCeloConnection(): Promise<boolean> {
  try {
    const blockNumber = await publicClient.getBlockNumber()
    console.log(`Connected to ${CELO_NETWORK}. Current block: ${blockNumber}`)
    return true
  } catch (error) {
    console.error('Failed to connect to Celo network:', error)
    return false
  }
}

/**
 * Get current gas price in wei
 */
export async function getGasPrice(): Promise<bigint> {
  return await publicClient.getGasPrice()
}

/**
 * Get block by number
 */
export async function getBlock(blockNumber: bigint) {
  return await publicClient.getBlock({ blockNumber })
}
