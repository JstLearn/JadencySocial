# Prioritizer Agent

The Prioritizer Agent manages the sales pipeline queue, determining which leads should be contacted and when.

## Responsibilities

- **Queue Management**: Maintain prioritized list of leads awaiting contact
- **Resource Allocation**: Balance workload across available sales resources
- **Timing Optimization**: Schedule contacts for optimal times based on business type
- **Capacity Planning**: Ensure pipeline doesn't exceed call capacity
- **Dead Lead Management**: Identify and archive leads that need re-engagement

## Queue Management Rules

### Priority Tiers

| Tier | Criteria | Target Response Time |
|------|----------|---------------------|
| Critical | Score >= 80, HOT timeline | Within 2 hours |
| High | Score 60-79, recent activity | Within 24 hours |
| Medium | Score 40-59 | Within 3 days |
| Low | Score < 40 | Within 1 week |

### Contact Sequencing

1. **Morning Block (09:00-11:00)**: High-value prospects, enterprise leads
2. **Mid-morning (11:00-12:00)**: Follow-ups, warm leads
3. **Afternoon Block (14:00-16:00)**: Standard outreach, medium priority
4. **Late Afternoon (16:00-18:00)**: Final touches, quick closes

### Business-Specific Timing

- **Restaurants**: Contact Tue-Thu, 10:00-11:00 (before lunch prep)
- **Hotels**: Contact Mon-Wed, 09:00-10:00 (before meetings)
- **Retail**: Contact Wed-Fri, 14:00-16:00 (post-lunch lull)
- **Service**: Contact Mon-Thu, 11:00-12:00 (morning rapport)

## Capacity Limits

```typescript
interface CapacityConfig {
  dailyCallLimit: number;      // Per agent, e.g., 30
  hourlyCallLimit: number;     // e.g., 5
  maxFollowUps: number;       // Per lead, e.g., 5
  coldOutreachDaily: number;   // New contacts per day, e.g., 15
}
```

## Pipeline States

```
NEW → QUEUED → ASSIGNED → CONTACTED → QUALIFIED → PROPOSAL → NEGOTIATION → WON/LOST
                         ↓
                      NOT_INTERESTED → COLD_LEAD → RE_ENGAGE (after 90 days)
```

## Re-engagement Strategy

- **Day 1**: Initial contact attempt
- **Day 3**: First follow-up
- **Day 7**: Second follow-up (new angle)
- **Day 14**: Third follow-up (case study)
- **Day 30**: Final attempt (breakup email)
- **Day 90+**: Re-engagement campaign eligible

## Output Format

```typescript
interface PrioritizedLead {
  leadId: string;
  position: number;
  scheduledContact: {
    date: Date;
    timeWindow: 'morning' | 'mid-morning' | 'afternoon' | 'late-afternoon';
    optimalTime: string; // HH:MM
  };
  assignedAgent?: string;
  outreachChannel: 'phone' | 'whatsapp' | 'email' | 'telegram';
  scriptVariant: 'standard' | 'urgent' | 'follow-up' | 're-engagement';
  retryCount: number;
  nextAction: 'call' | 'message' | 'email' | 'wait';
  notes?: string;
}
```

## Queue Optimization

The Prioritizer runs optimization to:

1. Ensure mix of priority tiers in daily queue
2. Balance workload across agents
3. Respect capacity limits
4. Maximize contact success rate
5. Minimize timezone issues

### Daily Queue Structure

```
┌─────────────────────────────────────────────────────────────┐
│  DAILY QUEUE - 50 leads                                     │
├─────────────────────────────────────────────────────────────┤
│  Critical (5)  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  High (15)     ████████████████████░░░░░░░░░░░░░░░░░░░░░  │
│  Medium (20)   ██████████████████████████████░░░░░░░░░░░░  │
│  Low (10)      ██████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────────────────────────────────┘
```

## Quality Standards

- Queue refreshed every 4 hours
- Leads auto-escalate if SLA breached
- Capacity utilization target: 85-95%
- No lead left in queue > 7 days without action
