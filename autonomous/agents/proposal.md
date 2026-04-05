# Proposal Agent

The Proposal Agent generates customized proposals and contracts for qualified leads.

## Responsibilities

- **Proposal Creation**: Generate professional PDF proposals for qualified prospects
- **Pricing**: Calculate accurate pricing based on scope and requirements
- **Customization**: Tailor content to specific business needs and pain points
- **Contract Generation**: Create service agreements and terms
- **Version Management**: Track proposal versions and updates

## Proposal Structure

```
1. Cover Page
   - Client business name and logo
   - Proposal title
   - Date and proposal number
   - Jadency Social branding

2. Executive Summary
   - Client's challenges
   - Our proposed solution
   - Expected outcomes

3. About Jadency Social
   - Company overview
   - Case studies (similar businesses)
   - Client testimonials

4. Scope of Services
   - Social media management
   - Content creation
   - Advertising
   - Reporting

5. Pricing
   - Package options
   - Itemized pricing
   - Payment terms

6. Timeline
   - Implementation plan
   - Milestones
   - Key dates

7. Terms & Conditions
   - Contract terms
   - Termination clause
   - IP rights

8. Next Steps
   - Onboarding process
   - Kickoff meeting
```

## Pricing Tiers

```typescript
interface PricingTier {
  name: string;
  monthlyPriceTRY: number;
  services: string[];
  postsPerMonth: number;
  platforms: string[];
  adBudget?: number; // Included ad spend
  revisions: number;
  reportingFrequency: 'weekly' | 'bi-weekly' | 'monthly';
}

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    monthlyPriceTRY: 15000,
    services: ['social_media_strategy', 'content_creation', 'posting'],
    postsPerMonth: 20,
    platforms: ['instagram', 'facebook'],
    revisions: 2,
    reportingFrequency: 'monthly'
  },
  {
    name: 'Growth',
    monthlyPriceTRY: 25000,
    services: ['social_media_strategy', 'content_creation', 'posting', 'community_management', 'basic_ads'],
    postsPerMonth: 30,
    platforms: ['instagram', 'facebook', 'google'],
    adBudget: 5000,
    revisions: 4,
    reportingFrequency: 'bi-weekly'
  },
  {
    name: 'Premium',
    monthlyPriceTRY: 40000,
    services: ['social_media_strategy', 'content_creation', 'posting', 'community_management', 'advanced_ads', 'influencer_marketing'],
    postsPerMonth: 50,
    platforms: ['instagram', 'facebook', 'google', 'tiktok', 'youtube'],
    adBudget: 10000,
    revisions: 8,
    reportingFrequency: 'weekly'
  }
];
```

## Customization Points

Based on lead data, proposals should customize:

- **Business Name/Logo**: Personalized cover and header
- **Pain Points**: Addressed in Executive Summary
- **Case Studies**: Include similar business examples
- **Pricing**: Pre-selected tier based on budget qualification
- **Timeline**: Adjusted based on seasonal factors
- **Platforms**: Focused on where their audience is

## Proposal Data Model

```typescript
interface Proposal {
  id: string;
  proposalNumber: string; // e.g., "JS-2024-0042"
  version: number;

  // Client Info
  clientId: string;
  clientName: string;
  clientContact: {
    name: string;
    email: string;
    phone: string;
  };
  clientBusiness: {
    name: string;
    category: string;
    website?: string;
    address: string;
  };

  // Proposal Content
  title: string;
  executiveSummary: string;
  painPoints: string[];
  proposedSolutions: string[];

  // Scope
  services: string[];
  platforms: string[];
  deliverables: Deliverable[];

  // Pricing
  selectedTier: PricingTier;
  customLineItems?: LineItem[];
  subtotalTRY: number;
  discountTRY: number;
  totalTRY: number;
  paymentTerms: string;

  // Timeline
  startDate: Date;
  contractLength: number; // months
  milestones: Milestone[];

  // Status
  status: 'draft' | 'sent' | 'viewed' | 'negotiating' | 'accepted' | 'rejected' | 'expired';
  sentAt?: Date;
  viewedAt?: Date;
  expiresAt: Date;

  // Tracking
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Deliverable {
  description: string;
  quantity: number;
  unit: string;
  frequency?: string;
}

interface LineItem {
  description: string;
  amountTRY: number;
}

interface Milestone {
  name: string;
  description: string;
  date: Date;
  deliverables: string[];
}
```

## Proposal Generation Flow

1. **Trigger**: Caller marks lead as qualified
2. **Data Collection**: Pull lead data, qualification notes, sentiment analysis
3. **Template Selection**: Choose base template based on category
4. **Customization**: Fill in business-specific details
5. **Pricing Calculation**: Apply tier and any custom items
6. **PDF Generation**: Render professional PDF
7. **Delivery**: Send via email/Telegram with tracking
8. **Follow-up**: Schedule follow-up based on open tracking

## Tracking & Analytics

- Open tracking (when email opened)
- Link click tracking
- Time spent viewing
- Version comparisons
- Win/loss analysis

## Quality Standards

- Proposals delivered within 24 hours of qualification
- Pricing accurate to within 5%
- All proposals proofread and spell-checked
- Version history maintained for all changes
- Auto-expire after 14 days

## Integration

- Input: Qualified leads from Caller
- Output: PDF proposals sent to client
- Storage: Proposals stored in database with version history
- E-Sign: Integration with signature service for acceptance
