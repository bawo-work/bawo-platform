/**
 * Withdrawal API logic
 * Allows workers to withdraw their balance to MiniPay wallet
 */

import { supabase } from '@/lib/supabase'
import { transferCUSDWithFeeAbstraction, weiToUsd } from '@/lib/blockchain/erc20'
import { publicClient } from '@/lib/blockchain/celo-client'
import { updateWorkerBalance } from '@/lib/blockchain/payments'

export interface WithdrawalRequest {
  workerId: string
  amountUSD: number
}

export interface WithdrawalResult {
  txHash: string
  success: boolean
  amountRequested: number
  amountSent: number
  fee: number
  message: string
}

/**
 * Process withdrawal to worker's MiniPay wallet
 * Transfers cUSD from platform to worker's wallet
 * Deducts amount from worker's balance
 *
 * @param request Withdrawal request details
 * @returns Withdrawal result with transaction hash
 */
export async function withdrawToWallet(
  request: WithdrawalRequest
): Promise<WithdrawalResult> {
  const { workerId, amountUSD } = request

  try {
    // 1. Validate amount
    if (amountUSD <= 0) {
      throw new Error('Withdrawal amount must be positive')
    }

    if (amountUSD < 0.01) {
      throw new Error('Minimum withdrawal is $0.01')
    }

    // 2. Get worker details
    const { data: worker, error: workerError } = await supabase
      .from('workers')
      .select('balance_usd, wallet_address')
      .eq('id', workerId)
      .single()

    if (workerError || !worker) {
      throw new Error('Worker not found')
    }

    if (!worker.wallet_address) {
      throw new Error('Worker has no wallet address')
    }

    // 3. Check sufficient balance
    const currentBalance = parseFloat(worker.balance_usd?.toString() || '0')

    if (currentBalance < amountUSD) {
      throw new Error(`Insufficient balance. Available: $${currentBalance.toFixed(2)}`)
    }

    // 4. Transfer cUSD to worker's wallet
    const { txHash, gasPaid } = await transferCUSDWithFeeAbstraction(
      worker.wallet_address,
      amountUSD
    )

    // 5. Calculate actual amounts
    const feeInUSD = weiToUsd(gasPaid)
    const netAmount = amountUSD - feeInUSD

    // 6. Wait for transaction confirmation
    await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
      confirmations: 1,
    })

    // 7. Deduct from worker balance
    await updateWorkerBalance(workerId, -amountUSD)

    // 8. Record withdrawal transaction
    const { error: txError } = await supabase.from('transactions').insert({
      worker_id: workerId,
      amount_usd: -amountUSD, // Negative for withdrawal
      fee_usd: feeInUSD,
      tx_type: 'withdrawal',
      tx_hash: txHash,
      status: 'confirmed',
    })

    if (txError) {
      console.error('Failed to record withdrawal:', txError)
      // Don't throw - withdrawal succeeded, just logging failed
    }

    console.log(`✅ Withdrawal: ${netAmount.toFixed(4)} cUSD sent to ${worker.wallet_address}`)

    return {
      txHash,
      success: true,
      amountRequested: amountUSD,
      amountSent: netAmount,
      fee: feeInUSD,
      message: `Successfully withdrew $${netAmount.toFixed(2)} to your MiniPay wallet`,
    }
  } catch (error: any) {
    console.error('Withdrawal failed:', error)

    // Record failed withdrawal
    await supabase.from('transactions').insert({
      worker_id: workerId,
      amount_usd: -amountUSD,
      tx_type: 'withdrawal',
      status: 'failed',
    })

    return {
      txHash: '',
      success: false,
      amountRequested: amountUSD,
      amountSent: 0,
      fee: 0,
      message: error.message || 'Withdrawal failed',
    }
  }
}

/**
 * Validate withdrawal request before processing
 * @param request Withdrawal request
 * @returns Validation result with errors if any
 */
export async function validateWithdrawal(
  request: WithdrawalRequest
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = []

  // Check amount
  if (request.amountUSD <= 0) {
    errors.push('Amount must be positive')
  }

  if (request.amountUSD < 0.01) {
    errors.push('Minimum withdrawal is $0.01')
  }

  // Check worker exists and has wallet
  const { data: worker, error } = await supabase
    .from('workers')
    .select('balance_usd, wallet_address')
    .eq('id', request.workerId)
    .single()

  if (error || !worker) {
    errors.push('Worker not found')
    return { valid: false, errors }
  }

  if (!worker.wallet_address) {
    errors.push('No wallet address configured')
  }

  // Check balance
  const balance = parseFloat(worker.balance_usd?.toString() || '0')
  if (balance < request.amountUSD) {
    errors.push(`Insufficient balance. Available: $${balance.toFixed(2)}`)
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Get withdrawal history for a worker
 * @param workerId Worker ID
 * @param limit Maximum number of records to return
 * @returns Array of withdrawal transactions
 */
export async function getWithdrawalHistory(
  workerId: string,
  limit: number = 50
) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('worker_id', workerId)
    .eq('tx_type', 'withdrawal')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Failed to fetch withdrawal history:', error)
    return []
  }

  return data || []
}
