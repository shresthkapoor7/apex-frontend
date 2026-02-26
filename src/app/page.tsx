"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Table, Search, Database } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="font-semibold tracking-tight text-slate-50">
            Apex
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="#"
              className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-slate-50"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-200"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-14">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.h1
              className="text-4xl font-semibold tracking-tight text-slate-50 md:text-5xl lg:text-6xl"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              Intelligent Underwriting for Modern Deal Teams.
            </motion.h1>
            <motion.p
              className="mt-6 text-lg text-slate-400 md:text-xl"
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Transform unstructured broker packages into structured financial
              intelligence with AI-native workflows.
            </motion.p>
          </motion.div>

          {/* Hero Mockup */}
          <motion.div
            className="relative mx-auto mt-16 max-w-5xl"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-white/20 via-white/5 to-transparent opacity-60" />
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/80 p-1 shadow-2xl">
              <div className="flex min-h-[360px] divide-x divide-white/10">
                {/* PDF Viewer mockup */}
                <div className="flex-[0.6] flex flex-col bg-slate-950/50">
                  <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
                    <div className="h-2 w-2 rounded-full bg-slate-600" />
                    <div className="h-2 w-2 rounded-full bg-slate-600" />
                    <div className="h-2 w-2 rounded-full bg-slate-600" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div
                        key={i}
                        className="h-3 rounded bg-slate-800/60"
                        style={{ width: `${85 - i * 5}%` }}
                      />
                    ))}
                    <div className="mt-4 flex gap-2">
                      <div className="h-8 w-16 rounded bg-slate-700/40" />
                      <div className="h-8 flex-1 rounded bg-slate-700/40" />
                      <div className="h-8 w-16 rounded bg-slate-700/40" />
                    </div>
                  </div>
                </div>
                {/* Metrics panel mockup */}
                <div className="flex-[0.4] flex flex-col gap-4 p-4">
                  <div className="space-y-2">
                    <div className="h-3 w-20 rounded bg-slate-700/60" />
                    <div className="grid grid-cols-2 gap-2">
                      {["$3.15M", "5.0%", "158K", "100%"].map((v, i) => (
                        <div
                          key={i}
                          className="rounded border border-white/5 bg-slate-800/40 px-3 py-2"
                        >
                          <div className="h-2 w-16 rounded bg-slate-600/60" />
                          <div className="mt-1 text-xs font-medium text-slate-300">
                            {v}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 rounded bg-slate-700/60" />
                    <div className="h-20 rounded border border-white/5 bg-slate-800/30" />
                    <div className="h-8 w-full rounded bg-slate-700/50" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Feature Grid */}
        <section className="border-t border-white/10 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              className="grid gap-8 md:grid-cols-3"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.div
                className="group rounded-xl border border-white/10 bg-slate-900/30 p-6 transition-colors hover:border-white/20 hover:bg-slate-900/50"
                variants={fadeUp}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-slate-800/50">
                  <Table className="h-5 w-5 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-50">
                  Structured Extraction
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Turning PDFs into clean financial JSON. Parse offering memos,
                  rent rolls, and operating statements with one upload.
                </p>
              </motion.div>
              <motion.div
                className="group rounded-xl border border-white/10 bg-slate-900/30 p-6 transition-colors hover:border-white/20 hover:bg-slate-900/50"
                variants={fadeUp}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-slate-800/50">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-50">
                  Semantic Retrieval
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  RAG-powered Q&A with page-level citations. Ask questions in
                  plain English and jump directly to source pages.
                </p>
              </motion.div>
              <motion.div
                className="group rounded-xl border border-white/10 bg-slate-900/30 p-6 transition-colors hover:border-white/20 hover:bg-slate-900/50"
                variants={fadeUp}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-slate-800/50">
                  <Database className="h-5 w-5 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-50">
                  Institutional Memory
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Your firm&apos;s entire deal history, queryable. Build a
                  searchable knowledge base across every package you&apos;ve
                  underwritten.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <motion.footer
          className="border-t border-white/10 py-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
            <div className="flex gap-6 text-sm">
              <Link
                href="/dashboard"
                className="text-slate-400 transition-colors hover:text-slate-50"
              >
                Product
              </Link>
              <a
                href="https://github.com/shresthkapoor7/apex-backend"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-slate-50"
              >
                Docs
              </a>
              <a
                href="https://www.linkedin.com/in/shresth-kapoor-7skp/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-slate-50"
              >
                Contact
              </a>
            </div>
            <p className="text-sm text-slate-500">Built by Apex</p>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
