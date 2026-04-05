# Reporter Agent

The Reporter Agent aggregates data, generates reports, and communicates results to clients and internal stakeholders.

## Responsibilities

- **Data Aggregation**: Collect metrics from all platforms (Meta, Google, etc.)
- **Report Generation**: Create comprehensive performance reports
- **Insight Extraction**: Identify key trends and actionable recommendations
- **Client Communication**: Deliver reports with context and next steps
- **Internal Dashboards**: Maintain real-time reporting for team visibility

## Report Types

### Client Reports

| Report | Frequency | Audience | Format |
|--------|-----------|----------|--------|
| Weekly Snapshot | Weekly | Client | Email + PDF |
| Monthly Performance | Monthly | Client | PDF + Meeting |
| Campaign Analysis | Per campaign | Client | PDF |
| Quarterly Business Review | Quarterly | Client + Leadership | Presentation |

### Internal Reports

| Report | Frequency | Audience | Format |
|--------|-----------|----------|--------|
| Sales Pipeline | Daily | Sales Team | Dashboard |
| Lead Status | Daily | Sales Manager | Email |
| Agent Performance | Weekly | Team Lead | Dashboard |
| Capacity Planning | Weekly | Leadership | PDF |
| Revenue Forecast | Monthly | Leadership | Spreadsheet |

## Metrics Framework

### Social Media Metrics

```typescript
interface SocialMetrics {
  platform: 'instagram' | 'facebook' | 'google' | 'tiktok' | 'youtube';

  // Audience
  followers: number;
  followerGrowth: number; // % change
  followerGrowthRate: number; // absolute

  // Engagement
  reach: number;
  impressions: number;
  engagementRate: number; // (likes + comments + shares) / reach
  likes: number;
  comments: number;
  shares: number;
  saves: number;

  // Content Performance
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
  topPerformingPost: PostMetrics;
  worstPerformingPost: PostMetrics;

  // Stories/Reels
  storyViews: number;
  reelViews: number;
  reelEngagement: number;

  // Growth
  profileVisits: number;
  websiteClicks: number;
  emailContacts: number;
}

interface PostMetrics {
  postId: string;
  date: Date;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
  engagementRate: number;
}
```

### Advertising Metrics

```typescript
interface AdMetrics {
  campaignId: string;
  campaignName: string;
  platform: 'meta' | 'google' | 'tiktok';

  // Spend
  spend: number; // TRY
  budget: number;
  budgetRemaining: number;

  // Reach
  impressions: number;
  reach: number;
  frequency: number; // avg views per person

  // Engagement
  clicks: number;
  ctr: number; // click through rate
  likes: number;
  comments: number;
  shares: number;

  // Conversion
  websiteVisits: number;
  leadFormSubmissions: number;
  phoneCalls: number;
  directionClicks: number;

  // ROI
  conversions: number;
  costPerConversion: number;
  roas: number; // return on ad spend
}
```

## Report Generation

### Weekly Snapshot Structure

```
WEEKLY PERFORMANCE SNAPSHOT
Client: [Business Name]
Period: [Date] - [Date]

1. HIGHLIGHTS
   - Best performing post
   - Key milestone reached
   - Notable trend

2. AUDIENCE GROWTH
   [Graph: Follower growth over time]
   +[X] new followers this week
   Total: [X] followers

3. ENGAGEMENT SUMMARY
   [Graph: Engagement rate trend]
   Avg engagement rate: [X]%
   Total interactions: [X]

4. TOP CONTENT
   [Top 3 performing posts with screenshots]

5. AD PERFORMANCE (if applicable)
   [Metrics table]

6. RECOMMENDATIONS
   - What to continue
   - What to improve
   - Suggested next week

7. NEXT WEEK PREVIEW
   - Planned campaigns
   - Important dates
```

### Monthly Report Structure

```
MONTHLY PERFORMANCE REPORT
Client: [Business Name]
Month: [Month Year]

1. EXECUTIVE SUMMARY
   - Month highlights
   - Goal progress
   - Overall assessment

2. KPI DASHBOARD
   [Visual dashboard with all key metrics]

3. PLATFORM BREAKDOWN
   [Detailed metrics per platform]

4. CONTENT ANALYSIS
   - Top performing content types
   - Best posting times
   - Hashtag performance

5. CAMPAIGN PERFORMANCE
   [Detailed campaign metrics]

6. COMPARISON TO PAST PERIOD
   [Month over month analysis]

7. COMPETITIVE BENCHMARKING
   [How client compares to category average]

8. RECOMMENDATIONS
   [Actionable insights]

9. NEXT MONTH PLAN
   [Preview of upcoming campaigns]
```

## Dashboard Specifications

### Real-Time Dashboard (Internal)

```typescript
interface DashboardConfig {
  widgets: DashboardWidget[];
  refreshInterval: number; // seconds
  filters: DashboardFilter[];
}

interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'funnel' | 'gauge';
  title: string;
  dataSource: string;
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, unknown>;
}
```

### Key Dashboard Views

1. **Sales Pipeline**
   - Leads by stage (funnel)
   - Daily new leads
   - Conversion rates
   - Agent performance table

2. **Operations**
   - Active clients
   - Content scheduled
   - Campaigns running
   - Tasks pending

3. **Financials**
   - MRR (Monthly Recurring Revenue)
   - New revenue this month
   - Churned clients
   - Outstanding invoices

## Report Delivery

```typescript
interface ReportDelivery {
  reportId: string;
  reportType: 'weekly' | 'monthly' | 'campaign' | 'custom';

  // Recipients
  recipients: {
    name: string;
    email: string;
    role: 'client' | 'internal';
  }[];

  // Delivery
  channels: ('email' | 'telegram' | 'dashboard' | 'meeting')[];
  scheduledAt: Date;
  sentAt?: Date;

  // Confirmation
  openedAt?: Date;
  confirmedAt?: Date;
  feedback?: string;
}
```

## Quality Standards

- Reports delivered on scheduled day by 10:00
- All data verified for accuracy
- Charts visually consistent (color palette, fonts)
- Insights actionable and specific
- Recommendations prioritized
- Executive summary < 1 page
- Full report with sufficient detail

## Integration

- Data Sources: Meta Business, Google Ads, TikTok Ads, analytics
- Storage: Report files stored in cloud
- Delivery: Email via Resend, Telegram for alerts
- Scheduling: Automated via cron jobs
- Archive: 12 months rolling history
