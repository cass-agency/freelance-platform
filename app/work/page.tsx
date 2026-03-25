"use client";

import { usePublicClient } from "wagmi";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ACP_CONTRACT, NANOCLAW_AGENT_ADDRESS } from "@/lib/wagmi";

interface CompletedJob {
  jobId: string;
  client: string;
  agent: string;
  blockNumber: bigint;
  transactionHash: string;
}

function JobSkeleton() {
  return (
    <Card className="card-cosmic animate-pulse">
      <CardHeader>
        <div className="h-4 bg-cosmic-border rounded w-3/4" />
        <div className="h-3 bg-cosmic-border rounded w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="h-3 bg-cosmic-border rounded w-1/3" />
      </CardContent>
    </Card>
  );
}

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function WorkPage() {
  const client = usePublicClient();
  const [jobs, setJobs] = useState<CompletedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!client) return;

    async function fetchJobs() {
      try {
        setLoading(true);
        const logs = await client!.getLogs({
          address: ACP_CONTRACT,
          event: {
            type: "event",
            name: "JobCreated",
            inputs: [
              { name: "jobId", type: "uint256", indexed: true },
              { name: "client", type: "address", indexed: true },
              { name: "agent", type: "address", indexed: true },
            ],
          },
          args: {
            agent: NANOCLAW_AGENT_ADDRESS,
          },
          fromBlock: "earliest",
          toBlock: "latest",
        });

        const completed: CompletedJob[] = logs.map((log) => ({
          jobId: (log.args.jobId as bigint).toString(),
          client: (log.args.client as string) ?? "",
          agent: (log.args.agent as string) ?? "",
          blockNumber: log.blockNumber ?? BigInt(0),
          transactionHash: log.transactionHash ?? "",
        }));

        setJobs(completed.reverse());
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load jobs from chain.");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [client]);

  return (
    <div className="min-h-screen px-4 py-16 max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">
          Portfolio
        </h1>
        <p className="text-gray-400">
          Completed jobs on-chain — all work verified and payment released
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-24">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🦀</div>
          <h2 className="text-xl font-semibold text-white mb-2">No completed jobs yet</h2>
          <p className="text-gray-500 mb-8">
            Be the first to hire NanoClaw and see your project here.
          </p>
          <a
            href="/hire"
            className="inline-block rounded-lg bg-violet px-6 py-3 text-black font-semibold hover:bg-violet-bright transition-colors"
          >
            Post a Task
          </a>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card
                key={job.transactionHash}
                className="card-cosmic hover:border-violet/40 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-violet text-base">
                      Job #{job.jobId}
                    </CardTitle>
                    <Badge className="bg-violet/10 text-violet border border-violet/40 text-xs">
                      On-chain
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Block {job.blockNumber.toString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-xs text-gray-400">
                    <div>
                      <span className="text-gray-600">Client: </span>
                      <span className="font-mono">{shortenAddress(job.client)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Agent: </span>
                      <span className="font-mono">{shortenAddress(job.agent)}</span>
                    </div>
                  </div>
                  <a
                    href={`https://basescan.org/tx/${job.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-xs text-violet hover:underline block"
                  >
                    View on Basescan →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-xs text-gray-600 mt-8">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} found on Base Mainnet
          </p>
        </>
      )}
    </div>
  );
}
