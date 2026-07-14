import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Mail, Loader2, Wand2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { PageHeader } from "@/components/PageHeader";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Aura" },
      { name: "description", content: "Generate professional emails with tone and audience controls." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<"formal" | "informal" | "persuasive">("formal");
  const [audience, setAudience] = useState<"client" | "manager" | "team member">("client");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await run({ data: { topic, context, tone, audience } });
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
        icon={Mail}
        eyebrow="Writing"
        title="Smart Email Generator"
        description="Describe what you need to say. Choose a tone and audience — Aura will draft it."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <form
          onSubmit={submit}
          className="lg:col-span-2 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card"
        >
          <div className="space-y-1.5">
            <Label htmlFor="topic">What is the email about?</Label>
            <Input
              id="topic"
              placeholder="Follow up on Q3 proposal timeline"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="context">Extra context (optional)</Label>
            <Textarea
              id="context"
              placeholder="They asked for a revised delivery date last week..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-24 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="informal">Informal</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={(v) => setAudience(v as typeof audience)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="team member">Team member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading || !topic.trim()}
            className="w-full gap-2 rounded-xl bg-gradient-primary text-primary-foreground shadow-soft"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            {loading ? "Drafting..." : "Generate email"}
          </Button>
        </form>

        <div className="lg:col-span-3 space-y-4">
          {output ? (
            <AiOutput content={output} />
          ) : (
            <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
              <Mail className="h-8 w-8 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Your drafted email will appear here.
              </p>
            </div>
          )}
          <AiDisclaimer />
        </div>
      </div>
    </AppShell>
  );
}
