import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { CalendarClock, Loader2, Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generatePlan } from "@/lib/ai.functions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Aura" },
      { name: "description", content: "Generate prioritized daily and weekly plans." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(generatePlan);
  const [tasks, setTasks] = useState("");
  const [range, setRange] = useState<"daily" | "weekly">("daily");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tasks.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await run({ data: { tasks, range } });
      setOutput(res.content);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={CalendarClock}
        eyebrow="Plan"
        title="AI Task Planner"
        description="List your tasks. Aura prioritizes by urgency and importance, then builds a time-blocked plan."
      />
      <div className="grid gap-6 lg:grid-cols-5">
        <form
          onSubmit={submit}
          className="lg:col-span-2 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card"
        >
          <div className="space-y-1.5">
            <Label>Plan range</Label>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
              {(["daily", "weekly"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                    range === r
                      ? "bg-background text-foreground shadow-card"
                      : "text-muted-foreground",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tasks">Your tasks</Label>
            <Textarea
              id="tasks"
              placeholder={
                "- Prepare Q4 board deck (due Friday)\n- Review 3 PRs\n- 1:1 with Alex\n- Draft launch email\n- Deep work on onboarding redesign"
              }
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              className="min-h-56 rounded-xl text-sm leading-relaxed"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !tasks.trim()}
            className="w-full gap-2 rounded-xl bg-gradient-primary text-primary-foreground shadow-soft"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {loading ? "Planning..." : `Generate ${range} plan`}
          </Button>
        </form>
        <div className="lg:col-span-3 space-y-4">
          {output ? (
            <AiOutput content={output} />
          ) : (
            <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
              <CalendarClock className="h-8 w-8 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Your prioritized {range} plan will appear here.
              </p>
            </div>
          )}
          <AiDisclaimer />
        </div>
      </div>
    </AppShell>
  );
}
