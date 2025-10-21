// AI-powered email parsing using Vercel AI SDK

import { generateObject } from "ai"
import { z } from "zod"

const leadSchema = z.object({
  name: z.string().describe("Full name of the person"),
  email: z.string().email().describe("Email address"),
  company: z.string().nullable().describe("Company name if mentioned"),
  phone: z.string().nullable().describe("Phone number if mentioned"),
  intent: z.string().describe("What the person wants or is interested in"),
  urgency: z.enum(["low", "medium", "high"]).describe("How urgent the request seems"),
})

export type ParsedLead = z.infer<typeof leadSchema>

export async function parseEmailWithAI(emailContent: string, senderEmail: string): Promise<ParsedLead> {
  try {
    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: leadSchema,
      prompt: `You are an AI assistant that extracts lead information from emails.
      
Parse the following email and extract the lead information:

Email From: ${senderEmail}
Email Content:
${emailContent}

Extract the person's name, email, company (if mentioned), phone (if mentioned), their intent/what they want, and assess the urgency level.`,
    })

    return object
  } catch (error) {
    console.error("[v0] Error parsing email with AI:", error)
    // Fallback to basic parsing
    return {
      name: senderEmail.split("@")[0].replace(/[._]/g, " "),
      email: senderEmail,
      company: null,
      phone: null,
      intent: "Email inquiry",
      urgency: "medium",
    }
  }
}

export async function generateIntroEmail(lead: ParsedLead): Promise<string> {
  try {
    const { text } = await import("ai").then((mod) => mod.generateText)

    const result = await text({
      model: "openai/gpt-4o-mini",
      prompt: `Write a professional, friendly introduction email to ${lead.name} from ${lead.company || "their company"}.
      
They expressed interest in: ${lead.intent}

The email should:
- Thank them for reaching out
- Acknowledge their specific interest
- Suggest scheduling a call to discuss further
- Be concise (3-4 sentences)
- Have a professional but warm tone

Do not include a subject line or signature, just the email body.`,
    })

    return result.text
  } catch (error) {
    console.error("[v0] Error generating intro email:", error)
    return `Hi ${lead.name},\n\nThank you for reaching out! I'd love to discuss ${lead.intent} with you. Would you be available for a quick call this week?\n\nLooking forward to connecting!`
  }
}
