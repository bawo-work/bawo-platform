/**
 * Payment execution logic for worker payments
 * Handles cUSD transfers with fee abstraction
 */

import { formatUnits, parseUnits } from 'viem'
import { publicClient, createPlatformWallet } from './celo-client'
import { transferCUSD, transferCUSDWithFeeAbstraction, weiToUsd } from './erc20'
import { CUSD_DECIMALS } from './config'
import { supabase } from '@/lib/supabase'
import { PaymentResult } from './types'

/**
 * Pay a worker for completing a task
 * Transfers cUSD from platform wallet to worker's wallet
 * Updates worker balance and records transaction
 *
 * @param workerId Worker's ID in database
 * @param amountUSD Amount to pay in USD
 * @param taskId Optional task ID that triggered payment
 * @returns Payment result with transaction hash
 */
export async function payWorker(
  workerId: string,
  amountUSD: number,
  taskId?: string
): Promise<PaymentResult> {
  try {
    // 1. Get worker wallet address
    const { data: worker, error: workerError } = await supabase
      .from('workers')
      .select('wallet_address, balance_usd')
      .eq('id', workerId)
      .single()

    if (workerError || !worker) {
      throw new Error(`Worker ${workerId} not found`)
    }

    if (!worker.wallet_address) {
      throw new Error(`Worker ${workerId} has no wallet address`)
    }

    // 2. Transfer cUSD with fee abstraction
    const { txHash, gasPaid } = await transferCUSDWithFeeAbstraction(
      worker.wallet_address,
      amountUSD
    )

    // 3. Calculate fees
    const feeInUSD = weiToUsd(gasPaid)
    const netAmount = amountUSD - feeInUSD

    // 4. Wait for confirmation (Celo: typically <5 seconds)
    await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
      confirmations: 1,
    })

    // 5. Record transaction in database
    const { error: txError } = await supabase.from('transactions').insert({
      worker_id: workerId,
      amount_usd: netAmount,
      fee_usd: feeInUSD,
      tx_type: 'task_payment',
      tx_hash: txHash,
      status: 'confirmed',
      task_id: taskId,
    })

    if (txError) {
      console.error('Failed to record transaction:', txError)
      // Don't throw - payment succeeded, just logging failed
    }

    // 6. Update worker balance
    await updateWorkerBalance(workerId, netAmount)

    console.log(`✅ Paid ${netAmount.toFixed(4)} cUSD to worker ${workerId} (fee: ${feeInUSD.toFixed(4)})`)

    return {
      txHash,
      success: true,
      amount: amountUSD,
      netAmount,
      fee: feeInUSD,
    }
  } catch (error: any) {
    console.error('Payment failed:', error)

    // Record failed transaction
    await supabase.from('transactions').insert({
      worker_id: workerId,
      amount_usd: amountUSD,
      tx_type: 'task_payment',
      status: 'failed',
      task_id: taskId,
    })

    throw new Error(`Payment failed: ${error.message}`)
  }
}

/**
 * Pay multiple workers at once (batch payment)
 * More efficient than individual payments
 *
 * @param payments Array of {workerId, amount, taskId}
 * @returns Array of payment results
 */
export async function batchPayWorkers(
  payments: Array<{ workerId: string; amount: number; taskId?: string }>
): Promise<PaymentResult[]> {
  const results: PaymentResult[] = []

  // Execute payments sequentially to avoid nonce issues
  for (const payment of payments) {
    try {
      const result = await payWorker(payment.workerId, payment.amount, payment.taskId)
      results.push(result)
    } catch (error) {
      console.error(`Failed to pay worker ${payment.workerId}:`, error)
      results.push({
        txHash: '',
        success: false,
        amount: payment.amount,
      })
    }
  }

  return results
}

/**
 * Update worker's balance in database
 * @param workerId Worker ID
 * @param amountUSD Amount to add (can be negative for withdrawal)
 */
export async function updateWorkerBalance(
  workerId: string,
  amountUSD: number
): Promise<void> {
  // Get current balance
  const { data: worker, error: fetchError } = await supabase
    .from('workers')
    .select('balance_usd')
    .eq('id', workerId)
    .single()

  if (fetchError || !worker) {
    throw new Error(`Failed to fetch worker balance: ${fetchError?.message}`)
  }

  // Calculate new balance
  const currentBalance = parseFloat(worker.balance_usd?.toString() || '0')
  const newBalance = currentBalance + amountUSD

  // Update balance
  const { error: updateError } = await supabase
    .from('workers')
    .update({ balance_usd: newBalance })
    .eq('id', workerId)

  if (updateError) {
    throw new Error(`Failed to update worker balance: ${updateError.message}`)
  }
}

/**
 * Get worker's current balance
 * @param workerId Worker ID
 * @returns Balance in USD
 */
export async function getWorkerBalance(workerId: string): Promise<number> {
  const { data: worker, error } = await supabase
    .from('workers')
    .select('balance_usd')
    .eq('id', workerId)
    .single()

  if (error || !worker) {
    throw new Error(`Worker not found: ${workerId}`)
  }

  return parseFloat(worker.balance_usd?.toString() || '0')
}

/**
 * Send a payment with fee abstraction
 * Used by points/streaks/referrals systems
 * 
 * @param walletAddress Destination wallet address
 * @param amountUSD Amount to send in USD
 * @returns Transaction hash
 */
export async function sendPaymentWithFeeAbstraction(
  walletAddress: string,
  amountUSD: number
): Promise<string> {
  try {
    const { txHash } = await transferCUSDWithFeeAbstraction(walletAddress, amountUSD)
    
    // Wait for confirmation
    await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
      confirmations: 1,
    })
    
    return txHash
  } catch (error: any) {
    console.error('Fee abstraction payment failed:', error)
    throw new Error(`Payment failed: ${error.message}`)
  }
}

/**
 * Estimate gas fee for a payment
 * @param amountUSD Amount to transfer
 * @returns Estimated fee in USD
 */
export async function estimatePaymentFee(amountUSD: number): Promise<number> {
  try {
    const platformWallet = createPlatformWallet()
    const amountInWei = parseUnits(amountUSD.toString(), CUSD_DECIMALS)

    // Use a dummy address for estimation
    const dummyAddress = '0x0000000000000000000000000000000000000001'

    const gasPrice = await publicClient.getGasPrice()

    // Estimate gas for transfer (typically ~50,000 gas)
    const estimatedGas = 50000n

    const estimatedFee = gasPrice * estimatedGas

    return weiToUsd(estimatedFee)
  } catch (error) {
    console.error('Failed to estimate fee:', error)
    // Return conservative estimate if estimation fails
    return 0.01 // $0.01 conservative estimate
  }
}
