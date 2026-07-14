import { ShieldAlert } from "lucide-react";

export function AiDisclaimer() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-accent/50 p-4 text-sm text-accent-foreground">
      <ShieldAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
      <p>
        <span className="font-semibold">Responsible AI notice:</span> Aura uses AI to generate
        suggestions. Output can be inaccurate or biased. Review results before sharing and avoid
        pasting confidential, personal, or regulated information.
      </p>
    </div>
  );
}
