'use client'

import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { decodeEventLog } from 'viem'
import { ACP_ABI, ACP_CONTRACT, NANOCLAW_AGENT_ADDRESS, JobState } from '../wagmi'

export type JobStateLabel = 'Open' | 'Funded' | 'Submitted' | 'Completed' | 'Rejected' | 'Expired'

export interface Job {
  client: `0x${string}`
  agent: `0x${string}`
  evaluator: `0x${string}`
  state: JobState
  expiry: bigint
  resultUri: string
}

// Read job by ID, polling every 5s
export function useGetJob(jobId: string | undefined) {
  return useReadContract({
    address: ACP_CONTRACT,
    abi: ACP_ABI,
    functionName: 'getJob',
    args: jobId ? [BigInt(jobId)] : undefined,
    query: { refetchInterval: 5000, enabled: !!jobId },
  })
}

// Create a new job on-chain
// client is set as evaluator so they can approve/reject
export function useCreateJob() {
  const { writeContractAsync, isPending, error, reset } = useWriteContract()

  async function createJob(expiryDays = 30): Promise<`0x${string}`> {
    const expiry = BigInt(Math.floor(Date.now() / 1000) + expiryDays * 86400)
    return writeContractAsync({
      address: ACP_CONTRACT,
      abi: ACP_ABI,
      functionName: 'createJob',
      args: [NANOCLAW_AGENT_ADDRESS, '0x0000000000000000000000000000000000000000', expiry],
    })
  }

  return { createJob, isPending, error, reset }
}

// Parse job ID from transaction receipt's JobCreated event
export function parseJobIdFromReceipt(receipt: { logs: readonly { topics: readonly `0x${string}`[]; data: `0x${string}`; address: `0x${string}` }[] }): bigint | null {
  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: ACP_ABI,
        eventName: 'JobCreated',
        topics: [...log.topics] as [`0x${string}`, ...`0x${string}`[]],
        data: log.data,
      })
      if (decoded.args.jobId !== undefined) {
        return decoded.args.jobId
      }
    } catch {
      // not the event we're looking for
    }
  }
  return null
}

// Accept a delivered job (releases USDC to agent)
export function useAcceptJob() {
  const { writeContractAsync, isPending, error } = useWriteContract()

  async function acceptJob(jobId: bigint): Promise<`0x${string}`> {
    return writeContractAsync({
      address: ACP_CONTRACT,
      abi: ACP_ABI,
      functionName: 'acceptJob',
      args: [jobId],
    })
  }

  return { acceptJob, isPending, error }
}

// Reject a delivered job
export function useRejectJob() {
  const { writeContractAsync, isPending, error } = useWriteContract()

  async function rejectJob(jobId: bigint): Promise<`0x${string}`> {
    return writeContractAsync({
      address: ACP_CONTRACT,
      abi: ACP_ABI,
      functionName: 'rejectJob',
      args: [jobId],
    })
  }

  return { rejectJob, isPending, error }
}

export { useWaitForTransactionReceipt }
