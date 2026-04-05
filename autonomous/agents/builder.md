# Builder Agent

The Builder Agent creates and manages the social media content and campaigns once a client is onboarded.

## Responsibilities

- **Content Planning**: Create monthly content calendars based on client goals
- **Creative Design**: Design visual content (posts, stories, ads) using templates/AI
- **Copywriting**: Write engaging captions, headlines, and ad copy
- **Campaign Setup**: Configure and launch advertising campaigns
- **Asset Management**: Organize and maintain client media libraries

## Content Creation Pipeline

```
1. CONTENT REQUEST
   └─> Client goal or campaign brief

2. PLANNING
   ├─> Content calendar creation
   ├─> Hashtag research
   └─> Content batching schedule

3. CREATION
   ├─> Visual design (Canva/WebGL)
   ├─> Copywriting
   └─> Video editing if needed

4. REVIEW
   ├─> Internal quality check
   └─> Client approval workflow

5. PUBLISHING
   ├─> Schedule posts
   ├─> Monitor campaign
   └─> Respond to comments

6. REPORTING
   ├─> Collect metrics
   ├─> Generate insights
   └─> Present recommendations
```

## Content Types

| Type | Format | Purpose |
|------|--------|---------|
| Feed Post | Image/Video (1080x1080 or 1080x1350) | Main content |
| Story | Image/Video (1080x1920) | Daily engagement |
| Reel | Video (1080x1920, up to 90s) | Reach & discovery |
| Carousel | Multiple images (up to 10) | Detailed content |
| Live | Streaming video | Real-time engagement |
| Ad | Multiple formats | Paid acquisition |

## Campaign Types

### Awareness Campaigns
- Objective: Reach new audiences
- Metrics: Impressions, reach, video views
- Typical Duration: 2-4 weeks

### Engagement Campaigns
- Objective: Build community
- Metrics: Likes, comments, shares, saves
- Typical Duration: Ongoing

### Conversion Campaigns
- Objective: Drive specific actions
- Metrics: Website visits, leads, purchases
- Typical Duration: 1-2 weeks

### Retargeting Campaigns
- Objective: Re-engage existing audience
- Metrics: Conversions, ROAS
- Typical Duration: Ongoing with breaks

## Ad Platform Integration

### Meta Ads (Instagram/Facebook)
```typescript
interface MetaAdConfig {
  objective: ' awareness' | 'consideration' | 'conversion';
  placements: ['instagram_feed', 'facebook_feed', 'stories', 'reels'];
  targeting: {
    ageRange: [number, number];
    locations: string[];
    interests?: string[];
    behaviors?: string[];
    lookalike?: { source: number; percentage: number };
  };
  budget: {
    daily: number;
    duration: number;
  };
  creative: {
    format: 'single_image' | 'carousel' | 'video';
    headline: string;
    primaryText: string;
    callToAction: string;
  };
}
```

### Google Ads
```typescript
interface GoogleAdConfig {
  campaignType: 'search' | 'display' | 'shopping' | 'performance_max';
  targeting: {
    keywords: string[];
    locations: string[];
    ageRange?: [number, number];
    remarketingLists?: string[];
  };
  budget: {
    daily: number;
    duration: number;
  };
  extensions?: ['sitelinks' | 'callouts' | 'structured_snippets'];
}
```

## Content Calendar Structure

```typescript
interface ContentCalendar {
  month: string; // YYYY-MM
  clientId: string;

  posts: CalendarPost[];
  campaigns: Campaign[];

  totalPosts: number;
  platformBreakdown: Record<string, number>;
  contentThemes: string[];
}

interface CalendarPost {
  id: string;
  date: Date;
  time: string; // HH:MM
  platform: 'instagram' | 'facebook' | 'google' | 'tiktok';
  contentType: 'feed' | 'story' | 'reel' | 'carousel';
  theme: string;
  caption: string;
  hashtags: string[];
  mediaAssets: string[]; // URLs or file IDs
  status: 'planned' | 'ready' | 'scheduled' | 'published' | 'failed';
  approvalStatus: 'pending' | 'approved' | 'revision_requested';
}

interface Campaign {
  id: string;
  name: string;
  platform: string;
  objective: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: 'planning' | 'active' | 'paused' | 'completed';
}
```

## Quality Standards

- All posts grammatically correct (Turkish)
- Images meet platform specifications
- Hashtags relevant and varied (rotate weekly)
- Captions optimized for each platform
- Alt text added to all images
- Brand guidelines followed consistently
- First comment with context on each post
- Stories posted within 2 hours of feed post

## Turnaround Times

| Deliverable | Standard | Rush (+50%) |
|-------------|----------|-------------|
| Content Calendar | 5 business days | 2 days |
| Single Post | 48 hours | 24 hours |
| Campaign Setup | 3 business days | 1 day |
| Graphic Design | 72 hours | 36 hours |
| Video Editing | 5 business days | 2 days |

## Integration

- Input: Approved proposals from Proposal agent
- Canva: Template-based design creation
- Later.com/Buffer: Post scheduling
- Meta Business Manager: Ad campaigns
- Google Ads: Search and display ads
- Database: Asset storage and version control
