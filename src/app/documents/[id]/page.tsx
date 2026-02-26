"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { getDocument, queryDocument, getDocumentFileUrl } from "@/lib/api";
import { formatCurrency, formatPercent } from "@/lib/format";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const PdfViewer = dynamic(
  () => import("@/components/pdf-viewer").then((mod) => ({ default: mod.PdfViewer })),
  { ssr: false }
);
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function extractReferencedPage(answer: string): number | undefined {
  const match = answer.match(/[Pp]age\s+(\d+)/);
  return match ? parseInt(match[1], 10) : undefined;
}

export default function DocumentPage() {
  const params = useParams();
  const documentId = (params?.id as string) ?? "";
  const [question, setQuestion] = useState("");
  const [goToPage, setGoToPage] = useState<number | undefined>(undefined);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const { data: doc, isLoading, error } = useQuery({
    queryKey: ["document", documentId],
    queryFn: () => getDocument(documentId),
    enabled: !!documentId,
  });

  const queryMutation = useMutation({
    mutationFn: (q: string) => queryDocument(documentId, q),
  });

  const handleAsk = useCallback(
    (value?: string) => {
      const text = (value ?? question).trim();
      if (!text || queryMutation.isPending) return;
      queryMutation.mutate(text);
      setQuestion("");
    },
    [question, queryMutation]
  );

  const handleSourceClick = useCallback((page: number) => {
    setGoToPage(page);
  }, []);

  const handleGoToPageHandled = useCallback(() => {
    setGoToPage(undefined);
  }, []);

  const referencedPage = useMemo(() => {
    const answer = queryMutation.data?.answer;
    return answer ? extractReferencedPage(answer) : undefined;
  }, [queryMutation.data?.answer]);

  useEffect(() => {
    if (referencedPage != null && queryMutation.data) {
      setGoToPage(referencedPage);
    }
  }, [queryMutation.data, referencedPage]);

  if (!documentId) {
    return (
      <div className="min-h-screen p-6">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-destructive">
          Failed to load document: {(error as Error).message}
        </div>
        <Link href="/dashboard" className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const fileUrl = getDocumentFileUrl(documentId);
  const metrics = doc?.metrics;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/60 shrink-0">
        <div className="flex h-12 items-center justify-between px-4">
          <Link href="/dashboard" className="font-semibold tracking-tight">
            Apex
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Dashboard
          </Link>
        </div>
      </header>
      <main className="flex-1 flex min-h-0">
        <div className="flex-[0.6] flex flex-col border-r border-border/60 min-w-0">
          {isLoading ? (
            <div className="flex items-center justify-center flex-1 text-muted-foreground text-sm">
              Loading...
            </div>
          ) : (
            <PdfViewer
              fileUrl={fileUrl}
              goToPage={goToPage}
              onGoToPageHandled={handleGoToPageHandled}
              highlightedPage={referencedPage}
            />
          )}
        </div>
        <aside className="flex-[0.4] flex flex-col overflow-auto p-4 gap-4 min-w-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {doc && (
            <>
              <Card className="border-border/60 shrink-0">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-sm font-semibold">
                    Extracted Metrics
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {doc.file_name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-2 text-sm">
                  {metrics && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      <span className="text-muted-foreground">Purchase Price</span>
                      <span>{formatCurrency(metrics.purchase_price)}</span>
                      <span className="text-muted-foreground">NOI</span>
                      <span>{formatCurrency(metrics.noi)}</span>
                      <span className="text-muted-foreground">Cap Rate</span>
                      <span>{formatPercent(metrics.cap_rate)}</span>
                      <span className="text-muted-foreground">Occupancy</span>
                      <span>{formatPercent(metrics.occupancy)}</span>
                      <span className="text-muted-foreground">Units</span>
                      <span>{metrics.units ?? "—"}</span>
                      <span className="text-muted-foreground">Year Built</span>
                      <span>{metrics.year_built ?? "—"}</span>
                      <span className="text-muted-foreground col-span-2">Location</span>
                      <span className="col-span-2">{metrics.location ?? "—"}</span>
                    </div>
                  )}
                  {!metrics && doc.status !== "ready" && (
                    <p className="text-muted-foreground text-xs">
                      Metrics will be available when processing completes.
                    </p>
                  )}
                </CardContent>
              </Card>

              {metrics?.risk_summary && (
                <Card className="border-border/60 shrink-0">
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-sm font-semibold">
                      Risk Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {metrics.risk_summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className="border-border/60 flex-1 min-h-0 flex flex-col">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-sm font-semibold">
                    Ask Question
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Ask about this deal document
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4 flex flex-col gap-3 flex-1 min-h-0">
                  <div className="space-y-1.5">
                    <Label htmlFor="question" className="text-xs">
                      Question
                    </Label>
                    <Textarea
                      id="question"
                      placeholder="e.g. What are the key risks?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAsk((e.target as HTMLTextAreaElement).value);
                        }
                      }}
                      className="min-h-[72px] resize-none text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      disabled={queryMutation.isPending}
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAsk()}
                    disabled={!question.trim() || queryMutation.isPending}
                  >
                    {queryMutation.isPending ? "Asking..." : "Ask"}
                  </Button>
                  {queryMutation.data && (
                    <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <div className="text-sm">
                        <span className="text-muted-foreground text-xs font-medium">Answer</span>
                        <div className="mt-1 leading-relaxed text-sm [&_p]:my-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-0.5">
                          <ReactMarkdown>{queryMutation.data.answer}</ReactMarkdown>
                        </div>
                      </div>
                      {queryMutation.data.sources && queryMutation.data.sources.length > 0 && (
                        <Collapsible
                          open={sourcesOpen}
                          onOpenChange={setSourcesOpen}
                          className="mt-1"
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-full justify-start gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                            >
                              {sourcesOpen ? (
                                <ChevronDown className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronRight className="h-3.5 w-3.5" />
                              )}
                              Sources ({queryMutation.data.sources.length})
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="space-y-1.5 mt-2">
                              {queryMutation.data.sources.map((src, i) => {
                                const isReferenced = src.page != null && src.page === referencedPage;
                                return (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => src.page != null && handleSourceClick(src.page)}
                                    className={`block w-full text-left rounded border p-2 text-xs transition-colors ${
                                      isReferenced
                                        ? "border-primary/50 bg-primary/5 hover:bg-primary/10"
                                        : "border-border/60 hover:bg-muted/30"
                                    }`}
                                  >
                                    <span className="font-medium text-muted-foreground">
                                      Page {src.page ?? "?"}
                                    </span>
                                    {src.excerpt && (
                                      <p className="mt-1 text-muted-foreground line-clamp-2">
                                        {src.excerpt}
                                      </p>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )}
                    </div>
                  )}
                  {queryMutation.isError && (
                    <p className="text-sm text-destructive">
                      {(queryMutation.error as Error).message}
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}
