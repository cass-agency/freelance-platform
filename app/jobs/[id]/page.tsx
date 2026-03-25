"use client";

import { use, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetJob, useAcceptJob, useRejectJob, useWaitForTransactionReceipt } from "@/lib/hooks/useACP";
import { useFundJob } from "@/lib/hooks/useUSDC";
import { JOB_STATE_LABELS, JOB_STATE_COLORS, JobState } from "@/lib/wagmi";

function shortenAddr(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function StepIndicator({ currentState }: { currentState: number }) {
  const steps = [
    { state: JobState.Open, label: "Open", icon: "📝" },
    { state: JobState.Funded, label: "Funded", icon: "💰" },
    { state: JobState.Submitted, label: "Submitted", icon: "⚡" },
    { state: JobState.Completed, label: "Completed", icon: "✅" },
  ];

  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, i) => {
        const isDone = currentState > step.state || currentState === step.state;
        const isCurrent = currentState === step.state;
        return (
          <div key={step.state} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                  isDone
                    ? "border-violet bg-violet/20 text-violet"
                    : "border-cosmic-border text-gray-600"
                } ${isCurrent ? "ring-2 ring-violet/30 ring-offset-2 ring-offset-cosmic-black" : ""}`}
              >
                {step.icon}
              </div>
              <span
                className={`mt-1 text-xs font-medium ${
                  isDone ? "text-violet" : "text-gray-600"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-2 mb-5 ${
                  currentState > step.state ? "bg-violet" : "bg-cosmic-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const jobBudget = parseFloat(searchParams.get("budget") ?? "100") || 100;
  const { address, isConnected } = useAccount();

  const { data: jobRaw, isLoading, error: fetchError, refetch } = useGetJob(id);
  const { acceptJob, isPending: isAccepting } = useAcceptJob();
  const { rejectJob, isPending: isRejecting } = useRejectJob();
  const { fundJob, isPending: isFunding } = useFundJob();

  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingTxHash, setPendingTxHash] = useState<`0x${string}` | undefined>();
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const { isLoading: isTxPending, data: txReceipt } = useWaitForTransactionReceipt({
    hash: pendingTxHash,
    query: { enabled: !!pendingTxHash },
  });

  // Refetch job state after tx confirms
  useEffect(() => {
    if (txReceipt && pendingTxHash) {
      setPendingTxHash(undefined);
      refetch();
    }
  }, [txReceipt, pendingTxHash, refetch]);

  const job = jobRaw as {
    client: `0x${string}`;
    agent: `0x${string}`;
    evaluator: `0x${string}`;
    state: number;
    expiry: bigint;
    resultUri: string;
  } | undefined;

  const isClient = job && address && address.toLowerCase() === job.client.toLowerCase();
  const jobId = BigInt(id);
  const expiryDate = job ? new Date(Number(job.expiry) * 1000) : null;
  const isExpired = expiryDate ? expiryDate < new Date() : false;

  async function handleFund() {
    if (!job) return;
    setActionError(null);
    try {
      const amount = BigInt(Math.round(jobBudget * 1_000_000));
      const { fundTxHash } = await fundJob(jobId, amount);
      setPendingTxHash(fundTxHash);
      setActionSuccess("Funding submitted! Waiting for confirmation…");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Transaction failed";
      setActionError(msg.includes("User rejected") ? "Transaction cancelled." : msg);
    }
  }

  async function handleApprove() {
    if (!job) return;
    setActionError(null);
    try {
      const hash = await acceptJob(jobId);
      setPendingTxHash(hash);
      setActionSuccess("Approval submitted! Payment will be released to NanoClaw.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Transaction failed";
      setActionError(msg.includes("User rejected") ? "Transaction cancelled." : msg);
    }
  }

  async function handleReject() {
    if (!job) return;
    setActionError(null);
    try {
      const hash = await rejectJob(jobId);
      setPendingTxHash(hash);
      setActionSuccess("Rejection submitted. NanoClaw will review and resubmit.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Transaction failed";
      setActionError(msg.includes("User rejected") ? "Transaction cancelled." : msg);
    }
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <a href="/work" className="text-sm text-gray-500 hover:text-violet transition-colors">
            ← Back to Portfolio
          </a>
          <div className="flex items-center justify-between mt-3">
            <h1 className="text-2xl font-bold text-white">
              Job <span className="text-violet font-mono">#{id}</span>
            </h1>
            {job && (
              <Badge className={`${JOB_STATE_COLORS[job.state]} border text-xs px-3 py-1`}>
                {JOB_STATE_LABELS[job.state] ?? "Unknown"}
              </Badge>
            )}
          </div>
        </div>

        {/* Wallet */}
        {!isConnected && (
          <Card className="card-cosmic mb-6 border-gold/30">
            <CardContent className="py-4 flex items-center justify-between gap-4">
              <p className="text-sm text-gray-400">Connect to interact with this job.</p>
              <ConnectButton />
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {isLoading && (
          <Card className="card-cosmic">
            <CardContent className="py-12 text-center">
              <div className="text-4xl mb-3 animate-pulse">🦀</div>
              <p className="text-gray-500 text-sm">Loading job from chain…</p>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {fetchError && !isLoading && (
          <Card className="card-cosmic border-red-500/30">
            <CardContent className="py-8 text-center">
              <p className="text-red-400 text-sm mb-3">Failed to load job #{id}</p>
              <p className="text-gray-600 text-xs">{fetchError.message}</p>
              <button
                onClick={() => refetch()}
                className="mt-4 text-xs text-violet hover:underline"
              >
                Try again
              </button>
            </CardContent>
          </Card>
        )}

        {/* Job content */}
        {job && !isLoading && (
          <>
            {/* State progress */}
            {job.state < JobState.Rejected && (
              <Card className="card-cosmic mb-6">
                <CardContent className="py-6">
                  <StepIndicator currentState={job.state} />
                </CardContent>
              </Card>
            )}

            {/* Job details */}
            <Card className="card-cosmic mb-6">
              <CardHeader>
                <CardTitle className="text-white text-base">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Client</p>
                    <p className="font-mono text-gray-300 text-xs">{shortenAddr(job.client)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Agent</p>
                    <p className="font-mono text-gray-300 text-xs">{shortenAddr(job.agent)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Status</p>
                    <Badge className={`${JOB_STATE_COLORS[job.state]} border text-xs`}>
                      {JOB_STATE_LABELS[job.state]}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Expires</p>
                    <p className={`text-xs ${isExpired ? "text-red-400" : "text-gray-300"}`}>
                      {expiryDate?.toLocaleDateString()} {isExpired && "(expired)"}
                    </p>
                  </div>
                </div>

                {/* Result URI */}
                {job.resultUri && (
                  <div className="pt-2 border-t border-cosmic-border">
                    <p className="text-gray-600 text-xs mb-1">Deliverable</p>
                    <a
                      href={job.resultUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet text-xs hover:underline break-all"
                    >
                      {job.resultUri}
                    </a>
                  </div>
                )}

                <div className="pt-2 border-t border-cosmic-border">
                  <a
                    href={`https://basescan.org/address/${job.client}#internaltx`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-600 hover:text-violet transition-colors"
                  >
                    View on Basescan →
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Transaction feedback */}
            {actionSuccess && (
              <div className="mb-4 rounded-lg bg-green-900/20 border border-green-500/30 px-4 py-3 text-sm text-green-400">
                {actionSuccess}
              </div>
            )}
            {actionError && (
              <div className="mb-4 rounded-lg bg-red-900/20 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                {actionError}
              </div>
            )}

            {/* Client actions */}
            {isConnected && isClient && (
              <Card className="card-cosmic border-violet/20">
                <CardHeader>
                  <CardTitle className="text-white text-base">Your Actions</CardTitle>
                  <p className="text-xs text-gray-500">You are the client for this job.</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {job.state === JobState.Open && (
                    <div>
                      <p className="text-sm text-gray-400 mb-3">
                        Fund the escrow to start work. NanoClaw will begin once payment is locked.
                      </p>
                      <button
                        onClick={handleFund}
                        disabled={isFunding || isTxPending}
                        className="w-full rounded-lg bg-gold py-3 font-semibold text-black text-sm hover:bg-gold-bright transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isFunding || isTxPending ? "⏳ Processing…" : `💰 Fund ${jobBudget} USDC`}
                      </button>
                    </div>
                  )}

                  {job.state === JobState.Submitted && (
                    <div>
                      <p className="text-sm text-gray-400 mb-3">
                        NanoClaw has submitted the deliverable. Review and approve to release payment.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={handleApprove}
                          disabled={isAccepting || isTxPending}
                          className="flex-1 rounded-lg bg-green-500/20 border border-green-500/40 py-3 font-semibold text-green-400 text-sm hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAccepting || isTxPending ? "⏳ Processing…" : "✅ Approve & Pay"}
                        </button>
                        <button
                          onClick={handleReject}
                          disabled={isRejecting || isTxPending}
                          className="flex-1 rounded-lg bg-red-500/20 border border-red-500/40 py-3 font-semibold text-red-400 text-sm hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isRejecting || isTxPending ? "⏳ Processing…" : "❌ Reject"}
                        </button>
                      </div>
                    </div>
                  )}

                  {job.state === JobState.Funded && (
                    <div className="text-center py-4">
                      <div className="text-2xl mb-2 animate-pulse">⚡</div>
                      <p className="text-sm text-gray-400">NanoClaw is working on your task…</p>
                      <p className="text-xs text-gray-600 mt-1">This page auto-refreshes every 5 seconds.</p>
                    </div>
                  )}

                  {job.state === JobState.Completed && (
                    <div className="text-center py-4">
                      <div className="text-2xl mb-2">🎉</div>
                      <p className="text-sm text-green-400 font-medium">Job completed! Payment released.</p>
                      <a
                        href="/hire"
                        className="mt-3 inline-block text-xs text-violet hover:underline"
                      >
                        Post another task →
                      </a>
                    </div>
                  )}

                  {job.state === JobState.Rejected && (
                    <div className="text-center py-4">
                      <div className="text-2xl mb-2">🔄</div>
                      <p className="text-sm text-yellow-400">Deliverable rejected — NanoClaw will resubmit.</p>
                    </div>
                  )}

                  {job.state === JobState.Expired && (
                    <div className="text-center py-4">
                      <p className="text-sm text-red-400">This job has expired.</p>
                      <a href="/hire" className="mt-2 inline-block text-xs text-violet hover:underline">
                        Post a new task →
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Non-client viewing */}
            {isConnected && !isClient && (
              <Card className="card-cosmic border-cosmic-border">
                <CardContent className="py-4 text-center">
                  <p className="text-xs text-gray-600">
                    You are viewing this job as an observer. Only the client ({shortenAddr(job.client)}) can take actions.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
