/**
 * Referral Bonus Payment - Triggered after referee completes 10 tasks
 * Referrer: $1.00, Referee: $0.50
 */

import { supabase } from '@/lib/supabase/client';
import { sendPaymentWithFeeAbstraction } from '@/lib/blockchain/payments';

/**
 * Check if referee has completed 10 tasks and pay bonuses
 * Called after each task submission
 */
export async function checkAndPayReferralBonus(refereeId: string): Promise<void> {
  // Get referee's task count
  const { count } = await supabase
    .from('task_responses')
    .select('*', { count: 'exact', head: true })
    .eq('worker_id', refereeId);

  // Only pay bonus on exactly the 10th task
  if (count !== 10) return;

  // Get referee and referrer details
  const { data: referee } = await supabase
    .from('workers')
    .select('referred_by, wallet_address')
    .eq('id', refereeId)
    .single();

  if (!referee || !referee.referred_by) return;

  // Check if bonus already paid
  const { data: existingBonus } = await supabase
    .from('transactions')
    .select('id')
    .eq('worker_id', referee.referred_by)
    .eq('tx_type', 'referral_bonus')
    .eq('status', 'confirmed')
    .limit(1);

  if (existingBonus && existingBonus.length > 0) return; // Already paid

  // Get referrer wallet
  const { data: referrer } = await supabase
    .from('workers')
    .select('wallet_address')
    .eq('id', referee.referred_by)
    .single();

  if (!referrer) return;

  try {
    // Pay referrer $1.00
    const referrerTxHash = await sendPaymentWithFeeAbstraction(
      referrer.wallet_address as `0x${string}`,
      1.0
    );

    await supabase.from('transactions').insert({
      worker_id: referee.referred_by,
      amount_usd: 1.0,
      fee_usd: 0.0002,
      tx_type: 'referral_bonus',
      tx_hash: referrerTxHash,
      status: 'confirmed',
    });

    // Pay referee $0.50
    const refereeTxHash = await sendPaymentWithFeeAbstraction(
      referee.wallet_address as `0x${string}`,
      0.5
    );

    await supabase.from('transactions').insert({
      worker_id: refereeId,
      amount_usd: 0.5,
      fee_usd: 0.0002,
      tx_type: 'referral_bonus',
      tx_hash: refereeTxHash,
      status: 'confirmed',
    });

    // Mark referral bonus as paid
    await supabase
      .from('workers')
      .update({ referral_bonus_paid: true })
      .eq('id', refereeId);

    console.log(`Referral bonus paid: Referrer ${referee.referred_by} = $1.00, Referee ${refereeId} = $0.50`);
  } catch (error) {
    console.error('Failed to pay referral bonus:', error);
  }
}
