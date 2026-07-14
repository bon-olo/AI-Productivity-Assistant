import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { FileText, Loader2, Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { summarizeNotes } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Aura" },
      {
        name: "description",
        content: "Extract summaries, decisions, action items, deadlines, and responsibilities.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const run = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (notes.trim().length < 10) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await run({ data: { notes } });
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
        icon={FileText}
        eyebrow="Analyze"
        title="Meeting Notes Summarizer"
        description="Paste raw meeting notes. Aura extracts key points, decisions, action items, deadlines, and owners."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card"
        >
          <div className="space-y-1.5">
            <Label htmlFor="notes">Meeting notes</Label>
            <Textarea
              id="notes"
              placeholder="Paste your meeting notes or transcript here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-72 rounded-xl font-mono text-xs leading-relaxed"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || notes.trim().length < 10}
            className="w-full gap-2 rounded-xl bg-gradient-primary text-primary-foreground shadow-soft"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {loading ? "Analyzing..." : "Summarize meeting"}
          </Button>
        </form>
        <div className="space-y-4">
          {output ? (
            <AiOutput content={output} />
          ) : (
            <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
              <FileText className="h-8 w-8 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Your structured summary will appear here.
              </p>
            </div>
          )}
          <AiDisclaimer />
        </div>
      </div>
    </AppShell>
  );
}
