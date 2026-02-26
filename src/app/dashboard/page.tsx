"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDocuments, type DocumentListItem } from "@/lib/api";
import { formatCurrency, formatPercent, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UploadModal } from "@/components/upload-modal";

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-1.5 pt-4 px-4">
        <CardDescription className="text-xs font-medium text-muted-foreground">
          {title}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-4 px-4">
        <CardTitle className="text-lg font-semibold tracking-tight">
          {value}
        </CardTitle>
      </CardContent>
    </Card>
  );
}

function computePortfolioMetrics(docs: DocumentListItem[]) {
  const withMetrics = docs.filter(
    (d) =>
      d.purchase_price != null ||
      d.cap_rate != null ||
      d.noi != null ||
      d.occupancy != null
  );
  const totalDeals = docs.length;
  const avgCapRate =
    withMetrics.filter((d) => d.cap_rate != null).length > 0
      ? withMetrics.reduce((s, d) => s + (d.cap_rate ?? 0), 0) /
        withMetrics.filter((d) => d.cap_rate != null).length
      : null;
  const avgNoi =
    withMetrics.filter((d) => d.noi != null).length > 0
      ? withMetrics.reduce((s, d) => s + (d.noi ?? 0), 0) /
        withMetrics.filter((d) => d.noi != null).length
      : null;
  const avgPurchase =
    withMetrics.filter((d) => d.purchase_price != null).length > 0
      ? withMetrics.reduce((s, d) => s + (d.purchase_price ?? 0), 0) /
        withMetrics.filter((d) => d.purchase_price != null).length
      : null;
  const avgOccupancy =
    withMetrics.filter((d) => d.occupancy != null).length > 0
      ? withMetrics.reduce((s, d) => s + (d.occupancy ?? 0), 0) /
        withMetrics.filter((d) => d.occupancy != null).length
      : null;
  return {
    totalDeals,
    avgCapRate,
    avgNoi,
    avgPurchase,
    avgOccupancy,
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: getDocuments,
  });

  const metrics = documents ? computePortfolioMetrics(documents) : null;

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-destructive">
          Failed to load documents: {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/60">
        <div className="flex h-12 items-center justify-between px-4">
          <Link href="/dashboard" className="font-semibold tracking-tight">
            Apex
          </Link>
          <div className="flex items-center gap-2">
            <UploadModal
              onSuccess={() => queryClient.invalidateQueries({ queryKey: ["documents"] })}
            />
          </div>
        </div>
      </header>
      <main className="p-4 space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Deal Intelligence
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Portfolio overview and deal analysis
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="border-border/60 animate-pulse">
                <CardHeader className="pb-1.5 pt-4 px-4">
                  <div className="h-3 w-16 rounded bg-muted" />
                </CardHeader>
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="h-5 w-24 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : metrics ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <MetricCard title="Total Deals" value={metrics.totalDeals} />
            <MetricCard
              title="Avg Cap Rate"
              value={formatPercent(metrics.avgCapRate)}
            />
            <MetricCard
              title="Avg NOI"
              value={formatCurrency(metrics.avgNoi)}
            />
            <MetricCard
              title="Avg Purchase Price"
              value={formatCurrency(metrics.avgPurchase)}
            />
            <MetricCard
              title="Avg Occupancy"
              value={formatPercent(metrics.avgOccupancy)}
            />
          </div>
        ) : null}

        <Card className="border-border/60">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-base font-semibold">Deals</CardTitle>
            <CardDescription className="text-xs">
              Click a row to view deal details
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {isLoading ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : !documents?.length ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No documents yet. Upload a PDF to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 hover:bg-transparent">
                    <TableHead className="font-medium">Deal Name</TableHead>
                    <TableHead className="font-medium">Location</TableHead>
                    <TableHead className="font-medium">Property Type</TableHead>
                    <TableHead className="font-medium">Purchase Price</TableHead>
                    <TableHead className="font-medium">NOI</TableHead>
                    <TableHead className="font-medium">Cap Rate</TableHead>
                    <TableHead className="font-medium">Occupancy</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium">Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow
                      key={doc.id}
                      className="cursor-pointer border-border/60"
                      onClick={() => router.push(`/documents/${doc.id}`)}
                    >
                      <TableCell className="font-medium">
                        {doc.file_name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {doc.location ?? "—"}
                      </TableCell>
                      <TableCell>{doc.property_type ?? "—"}</TableCell>
                      <TableCell>
                        {formatCurrency(doc.purchase_price)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(doc.noi)}
                      </TableCell>
                      <TableCell>
                        {formatPercent(doc.cap_rate)}
                      </TableCell>
                      <TableCell>
                        {formatPercent(doc.occupancy)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded px-1.5 py-0.5 text-xs font-medium ${
                            doc.status === "ready"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(doc.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
