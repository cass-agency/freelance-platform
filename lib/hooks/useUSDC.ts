'use client'

import { useWriteContract, useReadContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi'
import { USDC_ABI, USDC_CONTRACT, ACP_ABI, ACP_CONTRACT } from '../wagmi'

// USDC has 6 decimals: $1 = 1_000_000n
export function usdcToUnits(dollars: number): bigint {
  return BigInt(Math.round(dollars * 1_000_000))
}

export function unitsToUsdc(units: bigint): number {
  return Number(units) / 1_000_000
}

// Read USDC balance for an address
export function useUsdcBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: USDC_CONTRACT,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 10000 },
  })
}

// Fund a job: approve USDC spend, wait for confirmation, then call addBudget
export function useFundJob() {
  const publicClient = usePublicClient()
  const { writeContractAsync: writeApprove, isPending: isApprovePending } = useWriteContract()
  const { writeContractAsync: writeAddBudget, isPending: isAddBudgetPending } = useWriteContract()

  const isPending = isApprovePending || isAddBudgetPending

  async function fundJob(jobId: bigint, amount: bigint): Promise<{ approveTxHash: `0x${string}`; fundTxHash: `0x${string}` }> {
    if (!publicClient) throw new Error('No public client available')

    // Step 1: Approve ACP contract to spend USDC
    const approveTxHash = await writeApprove({
      address: USDC_CONTRACT,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [ACP_CONTRACT, amount],
    })

    // Step 2: Wait for approval to be mined before calling addBudget
    await publicClient.waitForTransactionReceipt({ hash: approveTxHash })

    // Step 3: Add budget to the job (allowance is now confirmed on-chain)
    const fundTxHash = await writeAddBudget({
      address: ACP_CONTRACT,
      abi: ACP_ABI,
      functionName: 'addBudget',
      args: [jobId, USDC_CONTRACT, amount],
    })

    return { approveTxHash, fundTxHash }
  }

  return { fundJob, isPending }
}

export { useWaitForTransactionReceipt }
