import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, CalendarClock, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiDisclaimer } from "@/components/AiDisclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aura — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Aura is your AI workplace assistant: draft emails, summarize meetings, plan your day and chat through work challenges.",
      },
      { property: "og:title", content: "Aura — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Aura is your AI workplace assistant: draft emails, summarize meetings, plan your day and chat through work challenges.",
      },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft polished emails with tone and audience controls.",
  },
  {
    to: "/notes",
    icon: FileText,
    title: "Meeting Notes Summarizer",
    desc: "Turn raw notes into key points, decisions, and action items.",
  },
  {
    to: "/planner",
    icon: CalendarClock,
    title: "AI Task Planner",
    desc: "Prioritize and time-block your day or week.",
  },
  {
    to: "/chat",
    icon: MessageCircle,
    title: "AI Assistant Chat",
    desc: "Ask, brainstorm, and organize with a workplace copilot.",
  },
] as const;

function Dashboard() {
  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-soft sm:p-12">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Your workplace copilot
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            Do focused work, faster.
          </h1>
          <p className="mt-3 max-w-xl text-base text-primary-foreground/90 sm:text-lg">
            Aura helps professionals write, plan, and think more clearly — with calm, thoughtful AI
            built for the modern workday.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-soft transition-transform hover:scale-[1.02]"
            >
              Start chatting <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Plan my day
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tools
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold tracking-tight">{f.title}</h3>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { k: "Focus", v: "Time-blocked plans that respect deep work." },
          { k: "Clarity", v: "Summaries that surface what matters most." },
          { k: "Polish", v: "On-tone writing for every audience." },
        ].map((s) => (
          <div key={s.k} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">{s.k}</div>
            <p className="mt-2 text-sm text-muted-foreground">{s.v}</p>
          </div>
        ))}
      </section>

      <div className="mt-10">
        <AiDisclaimer />
      </div>
    </AppShell>
  );
}
