-- JadencySocial Autonomous System - SQLite Schema
-- Created: 2026-04-04

-- ============================================================
-- LEADS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_name TEXT NOT NULL,
    owner_name TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    address TEXT,
    city TEXT DEFAULT 'Tekirdağ',
    district TEXT,
    google_place_id TEXT UNIQUE,
    google_maps_url TEXT,
    instagram_handle TEXT,
    facebook_url TEXT,
    linkedin_url TEXT,
    business_type TEXT,
    source TEXT DEFAULT 'manual',
    status TEXT DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'customer', 'rejected')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_district ON leads(district);
CREATE INDEX IF NOT EXISTS idx_leads_google_place_id ON leads(google_place_id);

-- ============================================================
-- ANALYSIS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS analysis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    website_score INTEGER CHECK(website_score >= 0 AND website_score <= 100),
    seo_score INTEGER CHECK(seo_score >= 0 AND seo_score <= 100),
    social_score INTEGER CHECK(social_score >= 0 AND social_score <= 100),
    content_score INTEGER CHECK(content_score >= 0 AND content_score <= 100),
    review_score INTEGER CHECK(review_score >= 0 AND review_score <= 100),
    overall_score INTEGER CHECK(overall_score >= 0 AND overall_score <= 100),
    website_checked BOOLEAN DEFAULT 0,
    website_issues TEXT,
    social_accounts_found TEXT,
    competitors_found TEXT,
    recommendations TEXT,
    analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analysis_lead_id ON analysis(lead_id);

-- ============================================================
-- CALLS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS calls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    twilio_call_sid TEXT,
    direction TEXT CHECK(direction IN ('outbound', 'inbound')),
    status TEXT DEFAULT 'queued' CHECK(status IN ('queued', 'in_progress', 'completed', 'failed', 'no_answer')),
    duration_seconds INTEGER,
    recording_url TEXT,
    transcript TEXT,
    summary TEXT,
    interest_level TEXT CHECK(interest_level IN ('high', 'medium', 'low', 'none')),
    follow_up_required BOOLEAN DEFAULT 0,
    called_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_calls_lead_id ON calls(lead_id);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);

-- ============================================================
-- PROPOSALS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS proposals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    proposal_number TEXT UNIQUE NOT NULL,
    services_included TEXT,
    total_price REAL,
    currency TEXT DEFAULT 'TRY',
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'paid')),
    stripe_payment_link TEXT,
    paid_at DATETIME,
    expires_at DATETIME,
    pdf_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_proposals_lead_id ON proposals(lead_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_proposal_number ON proposals(proposal_number);

-- ============================================================
-- DELIVERIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS deliveries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proposal_id INTEGER REFERENCES proposals(id) ON DELETE SET NULL,
    lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    task_type TEXT NOT NULL,
    task_details TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'delivered')),
    github_repo_url TEXT,
    deployed_url TEXT,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_deliveries_lead_id ON deliveries(lead_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_proposal_id ON deliveries(proposal_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);

-- ============================================================
-- CALL_QUEUE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS call_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    priority INTEGER DEFAULT 5 CHECK(priority >= 1 AND priority <= 10),
    scheduled_at DATETIME,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'called', 'skipped')),
    attempt_count INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    last_attempt_at DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_call_queue_status ON call_queue(status);
CREATE INDEX IF NOT EXISTS idx_call_queue_priority ON call_queue(priority);
CREATE INDEX IF NOT EXISTS idx_call_queue_scheduled_at ON call_queue(scheduled_at);

-- ============================================================
-- ACTIVITY_LOG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL CHECK(entity_type IN ('lead', 'call', 'proposal', 'delivery')),
    entity_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);

-- ============================================================
-- MIGRATIONS TABLE (for tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS _migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
