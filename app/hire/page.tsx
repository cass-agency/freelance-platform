'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useWaitForTransactionReceipt } from 'wagmi'
import { useCreateJob, parseJobIdFromReceipt } from '@/lib/hooks/useACP'
import { usdcToUnits } from '@/lib/hooks/useUSDC'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const PRESET_BUDGETS = [50, 100, 250, 500]

export default function HirePage() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const { createJob, isPending: isCreating, error: createError, reset } = useCreateJob()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState<number | ''>(100)
  const [customBudget, setCustomBudget] = useState('')
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [formError, setFormError] = useState<string | null>(null)
  const [submittedBudget, setSubmittedBudget] = useState<number>(0)

  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: !!txHash },
  })

  // Redirect once we have the receipt with a job ID
  useEffect(() => {
    if (receipt) {
      const jobId = parseJobIdFromReceipt(receipt)
      if (jobId !== null) {
        router.push(`/jobs/${jobId.toString()}?budget=${submittedBudget}`)
      }
    }
  }, [receipt, router, submittedBudget])

  const effectiveBudget = customBudget ? parseFloat(customBudget) : (budget as number)

  function validate(): string | null {
    if (!title.trim()) return 'Task title is required'
    if (description.trim().length < 50) return 'Description must be at least 50 characters'
    if (!effectiveBudget || effectiveBudget <= 0) return 'Please select a budget'
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    reset()

    const err = validate()
    if (err) { setFormError(err); return }

    try {
      setSubmittedBudget(effectiveBudget)
      const hash = await createJob(30)
      setTxHash(hash)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Transaction failed'
      setFormError(msg.includes('User rejected') ? 'Transaction cancelled' : msg)
    }
  }

  const isSubmitting = isCreating || isConfirming

  return (
    <main className="min-h-screen bg-background text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Post a Task</h1>
          <p className="text-white/60 text-sm">
            Describe your work, set a USDC budget, and NanoClaw gets started on Base.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
        >
          {/* Task Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80" htmlFor="title">
              Task Title
            </label>
            <Input
              id="title"
              placeholder="e.g. Build a REST API for my SaaS app"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80" htmlFor="description">
              Description
              <span className="text-white/40 font-normal ml-2">(min. 50 characters)</span>
            </label>
            <Textarea
              id="description"
              placeholder="Describe what you need in detail — requirements, deliverables, tech stack preferences, deadlines..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-violet min-h-[140px] resize-y"
              disabled={isSubmitting}
              required
            />
            <p className="text-xs text-white/30 text-right">
              {description.length} / 50+ chars
            </p>
          </div>

          {/* Budget */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white/80">
              Budget (USDC)
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_BUDGETS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => { setBudget(amount); setCustomBudget('') }}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    budget === amount && !customBudget
                      ? 'bg-gold/20 border-gold text-gold'
                      : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  ${amount}
                </button>
              ))}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                <Input
                  type="number"
                  placeholder="Custom"
                  value={customBudget}
                  onChange={(e) => { setCustomBudget(e.target.value); setBudget('') }}
                  disabled={isSubmitting}
                  min="1"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 pl-7 w-32 focus:border-gold"
                />
              </div>
            </div>
            {effectiveBudget > 0 && (
              <p className="text-xs text-white/40">
                = {usdcToUnits(effectiveBudget).toLocaleString()} USDC units (6 decimals)
              </p>
            )}
          </div>

          {/* Errors */}
          {(formError || createError) && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
              {formError ?? (createError as Error)?.message ?? 'An error occurred'}
            </div>
          )}

          {/* Submit */}
          {!isConnected ? (
            <div className="flex flex-col items-center gap-3 pt-2">
              <p className="text-white/50 text-sm">Connect your wallet to post a task</p>
              <ConnectButton />
            </div>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-violet hover:bg-violet/80 text-black font-semibold py-3 text-base rounded-xl transition-colors"
            >
              {isCreating
                ? 'Confirm in wallet…'
                : isConfirming
                ? 'Submitting to Base…'
                : 'Post Task on Base'}
            </Button>
          )}

          {isConfirming && txHash && (
            <p className="text-center text-white/40 text-xs">
              Waiting for confirmation…{' '}
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet underline"
              >
                View on Basescan
              </a>
            </p>
          )}
        </form>

        <p className="text-center text-white/30 text-xs mt-6">
          Your task brief is shared with NanoClaw off-chain. Budget is funded on Base after job creation.
        </p>
      </div>
    </main>
  )
}
