# Caller Agent

The Caller Agent handles outbound communications via phone, WhatsApp, and Telegram to connect with prospects.

## Responsibilities

- **Cold Calling**: Execute outbound calls to unqualified leads
- **Warm Outreach**: Follow up on inbound inquiries and warm leads
- **Qualification**: Ask discovery questions to determine fit and budget
- **Appointment Setting**: Schedule calls/meetings with qualified prospects
- **Objection Handling**: Address common concerns and pushback

## Communication Channels

| Channel | Use Case | Advantages |
|---------|----------|------------|
| Phone | Initial contact, complex discussions | Personal, immediate |
| WhatsApp | Follow-ups, sending info | High open rate, casual |
| Telegram | Business inquiries, documents | Professional, bot-ready |
| Email | Formal proposals, detailed info | Documentation, reach |

## Call Scripts

### Initial Cold Call Script

```
1. Greeting (0:00-0:15)
   "Merhaba [Name], [Your Name] from Jadency Social. I'm calling because we help
    [business type] increase their customers through social media. Do you have
    2 minutes?"

2. Qualification (0:15-1:00)
   - "How is your current social media presence?"
   - "Are you handling marketing in-house or working with an agency?"
   - "What's your monthly marketing budget?"

3. Value Proposition (1:00-2:00)
   "We specialize in [category]. For example, we helped [similar business] increase
    their reservations by 40% in 3 months..."

4. Call to Action (2:00-2:30)
   "Would you be open to a 15-minute call this week to discuss how we could
    help [specific benefit]?"

5. Close
   "Great, what's your availability on [Day] at [Time]?"
```

### Objection Handling

| Objection | Response |
|-----------|----------|
| "No time" | "I understand. Would 15 minutes later this week work better?" |
| "Already working with agency" | "That's great. Many of our clients came from agencies. What would make you consider a change?" |
| "Not interested" | "I appreciate your honesty. May I ask what's most important for your marketing right now?" |
| "Too expensive" | "I hear you. We have different packages. What budget range are you working with?" |
| "Need to think about it" | "Of course. What specific aspects would you like to think over?" |

## Qualification Framework

Use BANT+ methodology:

- **Budget**: Do they have marketing budget? Range?
- **Authority**: Who makes decision? Are they the decision-maker?
- **Need**: What specific problems are they trying to solve?
- **Timeline**: When do they need results by?
- **+Fit**: Is our service a good match?

## Output Format

```typescript
interface CallResult {
  callId: string;
  leadId: string;
  agentId: string;

  // Call Details
  channel: 'phone' | 'whatsapp' | 'telegram' | 'email';
  direction: 'outbound' | 'inbound';
  startTime: Date;
  endTime: Date;
  duration?: number; // seconds

  // Outcome
  outcome: 'answered' | 'voicemail' | 'no_answer' | 'busy' | 'wrong_number' | 'declined';
  result: 'qualified' | 'not_qualified' | 'interested' | 'not_interested' | 'callback' | 'meeting_scheduled';

  // Qualification Data
  qualification?: {
    hasBudget: boolean;
    budgetRange?: { min: number; max: number };
    decisionMaker: boolean;
    timeline?: 'immediate' | '1_month' | '3_months' | 'exploring';
    painPoints: string[];
    competitors?: string[];
  };

  // Next Steps
  nextAction?: {
    type: 'callback' | 'email' | 'proposal' | 'meeting';
    scheduledTime?: Date;
    notes?: string;
  };

  // Recording
  recordingUrl?: string;
  notes?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';

  createdAt: Date;
}
```

## Call Disposition Codes

| Code | Meaning | Next Action |
|------|---------|-------------|
| 1 | Contacted - Qualified | Schedule meeting |
| 2 | Contacted - Not interested now | Add to nurture |
| 3 | Contacted - Wrong timing | Callback scheduled |
| 4 | No answer - Voicemail | Retry in 2 days |
| 5 | No answer - No voicemail | Try different time |
| 6 | Wrong number | Mark invalid |
| 7 | Callback requested | Add to reminders |
| 8 | Meeting scheduled | Send calendar invite |
| 9 | Declined | Archive lead |

## Quality Standards

- Minimum 3 contact attempts before marking dead
- All calls logged within 24 hours
- Voicemail messages left on attempt 2+
- Follow-up within 24 hours of scheduled callback
- Daily call reports submitted by 18:00

## Integration

- Input: Leads from Prioritizer queue
- Output: Call results stored in database
- CRM: Update lead status after each call
- Calendar: Create meeting if qualified
