/**
 * ERC20 token interactions for cUSD
 * Provides functions to interact with the Celo Dollar (cUSD) token contract
 */

import { formatUnits, parseUnits } from 'viem'
import { publicClient, createPlatformWallet } from './celo-client'
import { CUSD_ADDRESS, CUSD_DECIMALS } from './config'

/**
 * Minimal ERC20 ABI for cUSD operations
 * Only includes the functions we need: transfer, balanceOf
 */
export const ERC20_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

/**
 * Get cUSD balance for an address
 * @param address Wallet address to check
 * @returns Balance in USD (as number with decimals)
 */
export async function getCUSDBalance(address: string): Promise<number> {
  try {
    const balance = (await publicClient.readContract({
      address: CUSD_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    })) as bigint

    // Convert from wei to USD
    return parseFloat(formatUnits(balance, CUSD_DECIMALS))
  } catch (error) {
    console.error('Failed to get cUSD balance:', error)
    throw new Error(`Failed to get balance for ${address}`)
  }
}

/**
 * Transfer cUSD from platform wallet to recipient
 * @param to Recipient address
 * @param amountUSD Amount in USD (will be converted to wei)
 * @returns Transaction hash
 */
export async function transferCUSD(
  to: string,
  amountUSD: number
): Promise<string> {
  const platformWallet = createPlatformWallet()
  const amountInWei = parseUnits(amountUSD.toString(), CUSD_DECIMALS)

  try {
    // Simulate the transaction first to catch errors early
    const { request } = await publicClient.simulateContract({
      address: CUSD_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [to as `0x${string}`, amountInWei],
      account: platformWallet.account,
    })

    // Execute the transaction
    const hash = await platformWallet.writeContract(request)

    return hash
  } catch (error: any) {
    console.error('cUSD transfer failed:', error)
    throw new Error(`Failed to transfer ${amountUSD} cUSD to ${to}: ${error.message}`)
  }
}

/**
 * Transfer cUSD with fee abstraction (pay gas in cUSD)
 * Celo allows paying gas fees in cUSD instead of CELO
 * @param to Recipient address
 * @param amountUSD Amount in USD
 * @returns Transaction hash and gas paid
 */
export async function transferCUSDWithFeeAbstraction(
  to: string,
  amountUSD: number
): Promise<{ txHash: string; gasPaid: bigint }> {
  const platformWallet = createPlatformWallet()
  const amountInWei = parseUnits(amountUSD.toString(), CUSD_DECIMALS)

  try {
    // Simulate with fee currency as cUSD
    const { request } = await publicClient.simulateContract({
      address: CUSD_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [to as `0x${string}`, amountInWei],
      account: platformWallet.account,
      // Specify feeCurrency to pay gas in cUSD
      feeCurrency: CUSD_ADDRESS,
    } as any) // Type assertion needed as viem types don't include Celo-specific fields

    // Execute transaction
    const hash = await platformWallet.writeContract(request)

    // Wait for receipt to get actual gas used
    const receipt = await publicClient.waitForTransactionReceipt({ hash })

    // Calculate gas paid (in wei)
    const gasPaid = receipt.gasUsed * (receipt.effectiveGasPrice || 0n)

    return { txHash: hash, gasPaid }
  } catch (error: any) {
    console.error('cUSD transfer with fee abstraction failed:', error)
    throw new Error(`Failed to transfer with fee abstraction: ${error.message}`)
  }
}

/**
 * Wait for transaction confirmation
 * @param txHash Transaction hash
 * @param confirmations Number of confirmations to wait for (default: 1)
 */
export async function waitForConfirmation(
  txHash: string,
  confirmations: number = 1
): Promise<void> {
  try {
    await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
      confirmations,
    })
  } catch (error) {
    console.error('Transaction confirmation failed:', error)
    throw new Error(`Transaction ${txHash} failed or was reverted`)
  }
}

/**
 * Get transaction receipt
 */
export async function getTransactionReceipt(txHash: string) {
  return await publicClient.getTransactionReceipt({
    hash: txHash as `0x${string}`,
  })
}

/**
 * Convert USD amount to wei
 */
export function usdToWei(amountUSD: number): bigint {
  return parseUnits(amountUSD.toString(), CUSD_DECIMALS)
}

/**
 * Convert wei to USD
 */
export function weiToUsd(amountWei: bigint): number {
  return parseFloat(formatUnits(amountWei, CUSD_DECIMALS))
}
