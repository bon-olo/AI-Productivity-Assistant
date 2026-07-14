import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailInput = z.object({
  topic: z.string().min(1),
  tone: z.enum(["formal", "informal", "persuasive"]),
  audience: z.enum(["client", "manager", "team member"]),
  context: z.string().optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const { callAI } = await import("./ai.server");
    const system = `You are a professional email writing assistant. Write clear, well-structured emails with subject line, greeting, body, and sign-off. Match the requested tone and audience precisely.`;
    const user = `Write an email.
Tone: ${data.tone}
Audience: ${data.audience}
Topic: ${data.topic}${data.context ? `\nAdditional context: ${data.context}` : ""}

Format:
Subject: <subject line>

<email body with greeting and sign-off>`;
    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    return { content };
  });

const NotesInput = z.object({ notes: z.string().min(10) });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => NotesInput.parse(d))
  .handler(async ({ data }) => {
    const { callAI } = await import("./ai.server");
    const system = `You are a meeting notes analyzer. Produce a clean markdown output with these sections:
## Summary
## Key Points
## Decisions
## Action Items
## Deadlines
## Responsibilities

Use bullet lists. Be concise and specific. If a section has no content, write "None".`;
    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: `Analyze these meeting notes:\n\n${data.notes}` },
    ]);
    return { content };
  });

const PlanInput = z.object({
  tasks: z.string().min(1),
  range: z.enum(["daily", "weekly"]),
});

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlanInput.parse(d))
  .handler(async ({ data }) => {
    const { callAI } = await import("./ai.server");
    const system = `You are a productivity coach. Create a structured ${data.range} plan in markdown.
Prioritize tasks using the Eisenhower matrix (urgency + importance).
Suggest time blocks and optimization strategies (batching, deep work, breaks).

Structure:
## Priority Overview
(quick urgent/important classification)

## ${data.range === "daily" ? "Daily Schedule" : "Weekly Plan"}
(time-blocked schedule)

## Optimization Tips
(3-5 concrete strategies for these specific tasks)`;
    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: `Tasks to plan:\n${data.tasks}` },
    ]);
    return { content };
  });

const ChatInput = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
});

export const chatAssistant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ChatInput.parse(d))
  .handler(async ({ data }) => {
    const { callAI } = await import("./ai.server");
    const system = `You are Aura, a friendly workplace productivity assistant. Help with planning, organization, writing, prioritization, and general work questions. Be concise, warm, and practical. Use markdown formatting when helpful.`;
    const content = await callAI([
      { role: "system", content: system },
      ...data.messages,
    ]);
    return { content };
  });
