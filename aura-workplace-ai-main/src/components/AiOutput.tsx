import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { FormattedContent } from "@/components/FormattedContent";

export function AiOutput({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  if (!content) return null;

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
      <Button
        size="sm"
        variant="ghost"
        onClick={copy}
        className="absolute right-3 top-3 h-8 gap-1.5 rounded-full text-xs"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </Button>
      <div className="pr-16">
        <FormattedContent content={content} />
      </div>
    </div>
  );
}
