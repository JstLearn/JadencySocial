import Database from 'better-sqlite3';
import { getDb, DB_PATH, closeDb } from './migrate.js';

export { getDb, DB_PATH, closeDb };

// ============================================================
// TYPES
// ============================================================

export interface Lead {
    id: number;
    business_name: string;
    owner_name: string | null;
    phone: string | null;
    email: string | null;
    website: string | null;
    address: string | null;
    city: string;
    district: string | null;
    google_place_id: string | null;
    google_maps_url: string | null;
    instagram_handle: string | null;
    facebook_url: string | null;
    linkedin_url: string | null;
    business_type: string | null;
    source: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface LeadInsert {
    business_name: string;
    owner_name?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    address?: string | null;
    city?: string;
    district?: string | null;
    google_place_id?: string | null;
    google_maps_url?: string | null;
    instagram_handle?: string | null;
    facebook_url?: string | null;
    linkedin_url?: string | null;
    business_type?: string | null;
    source?: string;
    status?: string;
}

export interface LeadUpdate {
    business_name?: string;
    owner_name?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    address?: string | null;
    city?: string;
    district?: string | null;
    google_place_id?: string | null;
    google_maps_url?: string | null;
    instagram_handle?: string | null;
    facebook_url?: string | null;
    linkedin_url?: string | null;
    business_type?: string | null;
    source?: string;
    status?: string;
}

export interface Analysis {
    id: number;
    lead_id: number;
    website_score: number | null;
    seo_score: number | null;
    social_score: number | null;
    content_score: number | null;
    review_score: number | null;
    overall_score: number | null;
    website_checked: number;
    website_issues: string | null;
    social_accounts_found: string | null;
    competitors_found: string | null;
    recommendations: string | null;
    analyzed_at: string;
}

export interface AnalysisInsert {
    lead_id: number;
    website_score?: number | null;
    seo_score?: number | null;
    social_score?: number | null;
    content_score?: number | null;
    review_score?: number | null;
    overall_score?: number | null;
    website_checked?: boolean;
    website_issues?: string[];
    social_accounts_found?: string[];
    competitors_found?: string[];
    recommendations?: string[];
}

export interface Call {
    id: number;
    lead_id: number;
    twilio_call_sid: string | null;
    direction: string | null;
    status: string;
    duration_seconds: number | null;
    recording_url: string | null;
    transcript: string | null;
    summary: string | null;
    interest_level: string | null;
    follow_up_required: number;
    called_at: string | null;
    created_at: string;
}

export interface CallInsert {
    lead_id: number;
    twilio_call_sid?: string | null;
    direction?: string;
    status?: string;
    duration_seconds?: number | null;
    recording_url?: string | null;
    transcript?: string | null;
    summary?: string | null;
    interest_level?: string | null;
    follow_up_required?: boolean;
    called_at?: string | null;
}

export interface Proposal {
    id: number;
    lead_id: number;
    proposal_number: string;
    services_included: string | null;
    total_price: number | null;
    currency: string;
    status: string;
    stripe_payment_link: string | null;
    paid_at: string | null;
    expires_at: string | null;
    pdf_path: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProposalInsert {
    lead_id: number;
    proposal_number: string;
    services_included?: string[];
    total_price?: number | null;
    currency?: string;
    status?: string;
    stripe_payment_link?: string | null;
    paid_at?: string | null;
    expires_at?: string | null;
    pdf_path?: string | null;
}

export interface Delivery {
    id: number;
    proposal_id: number | null;
    lead_id: number;
    task_type: string;
    task_details: string | null;
    status: string;
    github_repo_url: string | null;
    deployed_url: string | null;
    completed_at: string | null;
    created_at: string;
}

export interface DeliveryInsert {
    proposal_id?: number | null;
    lead_id: number;
    task_type: string;
    task_details?: Record<string, unknown>;
    status?: string;
    github_repo_url?: string | null;
    deployed_url?: string | null;
    completed_at?: string | null;
}

export interface CallQueueItem {
    id: number;
    lead_id: number;
    priority: number;
    scheduled_at: string | null;
    status: string;
    attempt_count: number;
    max_attempts: number;
    last_attempt_at: string | null;
    notes: string | null;
    created_at: string;
}

export interface CallQueueInsert {
    lead_id: number;
    priority?: number;
    scheduled_at?: string | null;
    status?: string;
    attempt_count?: number;
    max_attempts?: number;
    last_attempt_at?: string | null;
    notes?: string | null;
}

export interface ActivityLog {
    id: number;
    entity_type: string;
    entity_id: number;
    action: string;
    details: string | null;
    created_at: string;
}

export interface ActivityLogInsert {
    entity_type: string;
    entity_id: number;
    action: string;
    details?: Record<string, unknown>;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function toJson<T>(data: T | undefined | null): string | null {
    if (data === undefined || data === null) return null;
    return JSON.stringify(data);
}

// ============================================================
// LEAD FUNCTIONS
// ============================================================

export function getLeadById(id: number): Lead | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM leads WHERE id = ?').get(id) as Lead | undefined;
    return row || null;
}

export function getLeadByGooglePlaceId(googlePlaceId: string): Lead | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM leads WHERE google_place_id = ?').get(googlePlaceId) as Lead | undefined;
    return row || null;
}

export function createLead(lead: LeadInsert): Lead {
    const db = getDb();
    const stmt = db.prepare(`
        INSERT INTO leads (
            business_name, owner_name, phone, email, website, address,
            city, district, google_place_id, google_maps_url, instagram_handle,
            facebook_url, linkedin_url, business_type, source, status
        ) VALUES (
            @business_name, @owner_name, @phone, @email, @website, @address,
            @city, @district, @google_place_id, @google_maps_url, @instagram_handle,
            @facebook_url, @linkedin_url, @business_type, @source, @status
        )
    `);

    const result = stmt.run({
        business_name: lead.business_name,
        owner_name: lead.owner_name ?? null,
        phone: lead.phone ?? null,
        email: lead.email ?? null,
        website: lead.website ?? null,
        address: lead.address ?? null,
        city: lead.city ?? 'Tekirdağ',
        district: lead.district ?? null,
        google_place_id: lead.google_place_id ?? null,
        google_maps_url: lead.google_maps_url ?? null,
        instagram_handle: lead.instagram_handle ?? null,
        facebook_url: lead.facebook_url ?? null,
        linkedin_url: lead.linkedin_url ?? null,
        business_type: lead.business_type ?? null,
        source: lead.source ?? 'manual',
        status: lead.status ?? 'new'
    });

    logActivity('lead', result.lastInsertRowid as number, 'created', { business_name: lead.business_name });

    return getLeadById(result.lastInsertRowid as number)!;
}

export function updateLead(id: number, updates: LeadUpdate): Lead | null {
    const db = getDb();
    const current = getLeadById(id);
    if (!current) return null;

    const fields: string[] = [];
    const values: Record<string, unknown> = { id };

    if (updates.business_name !== undefined) {
        fields.push('business_name = @business_name');
        values.business_name = updates.business_name;
    }
    if (updates.owner_name !== undefined) {
        fields.push('owner_name = @owner_name');
        values.owner_name = updates.owner_name;
    }
    if (updates.phone !== undefined) {
        fields.push('phone = @phone');
        values.phone = updates.phone;
    }
    if (updates.email !== undefined) {
        fields.push('email = @email');
        values.email = updates.email;
    }
    if (updates.website !== undefined) {
        fields.push('website = @website');
        values.website = updates.website;
    }
    if (updates.address !== undefined) {
        fields.push('address = @address');
        values.address = updates.address;
    }
    if (updates.city !== undefined) {
        fields.push('city = @city');
        values.city = updates.city;
    }
    if (updates.district !== undefined) {
        fields.push('district = @district');
        values.district = updates.district;
    }
    if (updates.google_place_id !== undefined) {
        fields.push('google_place_id = @google_place_id');
        values.google_place_id = updates.google_place_id;
    }
    if (updates.google_maps_url !== undefined) {
        fields.push('google_maps_url = @google_maps_url');
        values.google_maps_url = updates.google_maps_url;
    }
    if (updates.instagram_handle !== undefined) {
        fields.push('instagram_handle = @instagram_handle');
        values.instagram_handle = updates.instagram_handle;
    }
    if (updates.facebook_url !== undefined) {
        fields.push('facebook_url = @facebook_url');
        values.facebook_url = updates.facebook_url;
    }
    if (updates.linkedin_url !== undefined) {
        fields.push('linkedin_url = @linkedin_url');
        values.linkedin_url = updates.linkedin_url;
    }
    if (updates.business_type !== undefined) {
        fields.push('business_type = @business_type');
        values.business_type = updates.business_type;
    }
    if (updates.source !== undefined) {
        fields.push('source = @source');
        values.source = updates.source;
    }
    if (updates.status !== undefined) {
        fields.push('status = @status');
        values.status = updates.status;
    }

    if (fields.length === 0) return current;

    fields.push('updated_at = CURRENT_TIMESTAMP');

    const sql = `UPDATE leads SET ${fields.join(', ')} WHERE id = @id`;
    db.prepare(sql).run(values);

    logActivity('lead', id, 'updated', updates as Record<string, unknown>);

    return getLeadById(id);
}

export function getLeads(options: {
    status?: string;
    district?: string;
    business_type?: string;
    limit?: number;
    offset?: number;
}): Lead[] {
    const db = getDb();
    const conditions: string[] = [];
    const params: Record<string, unknown> = {};

    if (options.status) {
        conditions.push('status = @status');
        params.status = options.status;
    }
    if (options.district) {
        conditions.push('district = @district');
        params.district = options.district;
    }
    if (options.business_type) {
        conditions.push('business_type = @business_type');
        params.business_type = options.business_type;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = options.limit ?? 100;
    const offset = options.offset ?? 0;

    const sql = `SELECT * FROM leads ${where} ORDER BY created_at DESC LIMIT @limit OFFSET @offset`;
    params.limit = limit;
    params.offset = offset;

    return db.prepare(sql).all(params) as Lead[];
}

export function getLeadsForCallQueue(limit: number = 50): (Lead & { call_queue_id: number; priority: number })[] {
    const db = getDb();
    return db.prepare(`
        SELECT l.*, cq.id as call_queue_id, cq.priority
        FROM leads l
        INNER JOIN call_queue cq ON l.id = cq.lead_id
        WHERE cq.status = 'pending'
          AND cq.attempt_count < cq.max_attempts
          AND (cq.scheduled_at IS NULL OR cq.scheduled_at <= CURRENT_TIMESTAMP)
        ORDER BY cq.priority ASC, cq.scheduled_at ASC
        LIMIT ?
    `).all(limit) as (Lead & { call_queue_id: number; priority: number })[];
}

// ============================================================
// ANALYSIS FUNCTIONS
// ============================================================

export function getAnalysisByLeadId(leadId: number): Analysis | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM analysis WHERE lead_id = ? ORDER BY analyzed_at DESC LIMIT 1').get(leadId) as Analysis | undefined;
    return row || null;
}

export function createAnalysis(analysis: AnalysisInsert): Analysis {
    const db = getDb();
    const stmt = db.prepare(`
        INSERT INTO analysis (
            lead_id, website_score, seo_score, social_score, content_score,
            review_score, overall_score, website_checked, website_issues,
            social_accounts_found, competitors_found, recommendations
        ) VALUES (
            @lead_id, @website_score, @seo_score, @social_score, @content_score,
            @review_score, @overall_score, @website_checked, @website_issues,
            @social_accounts_found, @competitors_found, @recommendations
        )
    `);

    const result = stmt.run({
        lead_id: analysis.lead_id,
        website_score: analysis.website_score ?? null,
        seo_score: analysis.seo_score ?? null,
        social_score: analysis.social_score ?? null,
        content_score: analysis.content_score ?? null,
        review_score: analysis.review_score ?? null,
        overall_score: analysis.overall_score ?? null,
        website_checked: analysis.website_checked ? 1 : 0,
        website_issues: toJson(analysis.website_issues),
        social_accounts_found: toJson(analysis.social_accounts_found),
        competitors_found: toJson(analysis.competitors_found),
        recommendations: toJson(analysis.recommendations)
    });

    return db.prepare('SELECT * FROM analysis WHERE id = ?').get(result.lastInsertRowid) as Analysis;
}

// ============================================================
// CALL FUNCTIONS
// ============================================================

export function getCallById(id: number): Call | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM calls WHERE id = ?').get(id) as Call | undefined;
    return row || null;
}

export function getCallsByLeadId(leadId: number): Call[] {
    const db = getDb();
    return db.prepare('SELECT * FROM calls WHERE lead_id = ? ORDER BY called_at DESC').all(leadId) as Call[];
}

export function createCall(call: CallInsert): Call {
    const db = getDb();
    const stmt = db.prepare(`
        INSERT INTO calls (
            lead_id, twilio_call_sid, direction, status, duration_seconds,
            recording_url, transcript, summary, interest_level, follow_up_required, called_at
        ) VALUES (
            @lead_id, @twilio_call_sid, @direction, @status, @duration_seconds,
            @recording_url, @transcript, @summary, @interest_level, @follow_up_required, @called_at
        )
    `);

    const result = stmt.run({
        lead_id: call.lead_id,
        twilio_call_sid: call.twilio_call_sid ?? null,
        direction: call.direction ?? 'outbound',
        status: call.status ?? 'queued',
        duration_seconds: call.duration_seconds ?? null,
        recording_url: call.recording_url ?? null,
        transcript: call.transcript ?? null,
        summary: call.summary ?? null,
        interest_level: call.interest_level ?? null,
        follow_up_required: call.follow_up_required ? 1 : 0,
        called_at: call.called_at ?? null
    });

    logActivity('call', result.lastInsertRowid as number, 'created', { lead_id: call.lead_id });

    return getCallById(result.lastInsertRowid as number)!;
}

export function updateCall(id: number, updates: Partial<Call>): Call | null {
    const db = getDb();
    const current = getCallById(id);
    if (!current) return null;

    const fields: string[] = [];
    const values: Record<string, unknown> = { id };

    const allowedFields = [
        'twilio_call_sid', 'direction', 'status', 'duration_seconds',
        'recording_url', 'transcript', 'summary', 'interest_level',
        'follow_up_required', 'called_at'
    ] as const;

    for (const field of allowedFields) {
        if ((updates as Record<string, unknown>)[field] !== undefined) {
            fields.push(`${field} = @${field}`);
            values[field] = (updates as Record<string, unknown>)[field];
        }
    }

    if (fields.length === 0) return current;

    const sql = `UPDATE calls SET ${fields.join(', ')} WHERE id = @id`;
    db.prepare(sql).run(values);

    return getCallById(id);
}

// ============================================================
// PROPOSAL FUNCTIONS
// ============================================================

export function getProposalById(id: number): Proposal | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM proposals WHERE id = ?').get(id) as Proposal | undefined;
    return row || null;
}

export function getProposalByNumber(proposalNumber: string): Proposal | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM proposals WHERE proposal_number = ?').get(proposalNumber) as Proposal | undefined;
    return row || null;
}

export function getProposalsByLeadId(leadId: number): Proposal[] {
    const db = getDb();
    return db.prepare('SELECT * FROM proposals WHERE lead_id = ? ORDER BY created_at DESC').all(leadId) as Proposal[];
}

export function createProposal(proposal: ProposalInsert): Proposal {
    const db = getDb();
    const stmt = db.prepare(`
        INSERT INTO proposals (
            lead_id, proposal_number, services_included, total_price,
            currency, status, stripe_payment_link, paid_at, expires_at, pdf_path
        ) VALUES (
            @lead_id, @proposal_number, @services_included, @total_price,
            @currency, @status, @stripe_payment_link, @paid_at, @expires_at, @pdf_path
        )
    `);

    const result = stmt.run({
        lead_id: proposal.lead_id,
        proposal_number: proposal.proposal_number,
        services_included: toJson(proposal.services_included),
        total_price: proposal.total_price ?? null,
        currency: proposal.currency ?? 'TRY',
        status: proposal.status ?? 'draft',
        stripe_payment_link: proposal.stripe_payment_link ?? null,
        paid_at: proposal.paid_at ?? null,
        expires_at: proposal.expires_at ?? null,
        pdf_path: proposal.pdf_path ?? null
    });

    logActivity('proposal', result.lastInsertRowid as number, 'created', { lead_id: proposal.lead_id, proposal_number: proposal.proposal_number });

    return getProposalById(result.lastInsertRowid as number)!;
}

export function updateProposal(id: number, updates: Partial<Proposal>): Proposal | null {
    const db = getDb();
    const current = getProposalById(id);
    if (!current) return null;

    const fields: string[] = [];
    const values: Record<string, unknown> = { id };

    const allowedFields = [
        'services_included', 'total_price', 'currency', 'status',
        'stripe_payment_link', 'paid_at', 'expires_at', 'pdf_path'
    ] as const;

    for (const field of allowedFields) {
        if ((updates as Record<string, unknown>)[field] !== undefined) {
            fields.push(`${field} = @${field}`);
            values[field] = (updates as Record<string, unknown>)[field];
        }
    }

    if (fields.length === 0) return current;

    fields.push('updated_at = CURRENT_TIMESTAMP');

    const sql = `UPDATE proposals SET ${fields.join(', ')} WHERE id = @id`;
    db.prepare(sql).run(values);

    return getProposalById(id);
}

// ============================================================
// DELIVERY FUNCTIONS
// ============================================================

export function getDeliveryById(id: number): Delivery | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM deliveries WHERE id = ?').get(id) as Delivery | undefined;
    return row || null;
}

export function getDeliveriesByLeadId(leadId: number): Delivery[] {
    const db = getDb();
    return db.prepare('SELECT * FROM deliveries WHERE lead_id = ? ORDER BY created_at DESC').all(leadId) as Delivery[];
}

export function getDeliveriesByProposalId(proposalId: number): Delivery[] {
    const db = getDb();
    return db.prepare('SELECT * FROM deliveries WHERE proposal_id = ? ORDER BY created_at DESC').all(proposalId) as Delivery[];
}

export function createDelivery(delivery: DeliveryInsert): Delivery {
    const db = getDb();
    const stmt = db.prepare(`
        INSERT INTO deliveries (
            proposal_id, lead_id, task_type, task_details,
            status, github_repo_url, deployed_url, completed_at
        ) VALUES (
            @proposal_id, @lead_id, @task_type, @task_details,
            @status, @github_repo_url, @deployed_url, @completed_at
        )
    `);

    const result = stmt.run({
        proposal_id: delivery.proposal_id ?? null,
        lead_id: delivery.lead_id,
        task_type: delivery.task_type,
        task_details: toJson(delivery.task_details),
        status: delivery.status ?? 'pending',
        github_repo_url: delivery.github_repo_url ?? null,
        deployed_url: delivery.deployed_url ?? null,
        completed_at: delivery.completed_at ?? null
    });

    logActivity('delivery', result.lastInsertRowid as number, 'created', { lead_id: delivery.lead_id, task_type: delivery.task_type });

    return getDeliveryById(result.lastInsertRowid as number)!;
}

export function updateDelivery(id: number, updates: Partial<Delivery>): Delivery | null {
    const db = getDb();
    const current = getDeliveryById(id);
    if (!current) return null;

    const fields: string[] = [];
    const values: Record<string, unknown> = { id };

    const allowedFields = [
        'task_details', 'status', 'github_repo_url', 'deployed_url', 'completed_at'
    ] as const;

    for (const field of allowedFields) {
        if ((updates as Record<string, unknown>)[field] !== undefined) {
            fields.push(`${field} = @${field}`);
            values[field] = (updates as Record<string, unknown>)[field];
        }
    }

    if (fields.length === 0) return current;

    const sql = `UPDATE deliveries SET ${fields.join(', ')} WHERE id = @id`;
    db.prepare(sql).run(values);

    return getDeliveryById(id);
}

// ============================================================
// CALL QUEUE FUNCTIONS
// ============================================================

export function getCallQueueItemById(id: number): CallQueueItem | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM call_queue WHERE id = ?').get(id) as CallQueueItem | undefined;
    return row || null;
}

export function getCallQueueByLeadId(leadId: number): CallQueueItem | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM call_queue WHERE lead_id = ? AND status = ? ORDER BY created_at DESC LIMIT 1').get(leadId, 'pending') as CallQueueItem | undefined;
    return row || null;
}

export function addToCallQueue(item: CallQueueInsert): CallQueueItem {
    const db = getDb();
    const stmt = db.prepare(`
        INSERT INTO call_queue (
            lead_id, priority, scheduled_at, status, attempt_count, max_attempts, notes
        ) VALUES (
            @lead_id, @priority, @scheduled_at, @status, @attempt_count, @max_attempts, @notes
        )
    `);

    const result = stmt.run({
        lead_id: item.lead_id,
        priority: item.priority ?? 5,
        scheduled_at: item.scheduled_at ?? null,
        status: item.status ?? 'pending',
        attempt_count: item.attempt_count ?? 0,
        max_attempts: item.max_attempts ?? 3,
        notes: item.notes ?? null
    });

    return getCallQueueItemById(result.lastInsertRowid as number)!;
}

export function updateCallQueueItem(id: number, updates: Partial<CallQueueItem>): CallQueueItem | null {
    const db = getDb();
    const current = getCallQueueItemById(id);
    if (!current) return null;

    const fields: string[] = [];
    const values: Record<string, unknown> = { id };

    const allowedFields = [
        'priority', 'scheduled_at', 'status', 'attempt_count', 'max_attempts', 'notes'
    ] as const;

    for (const field of allowedFields) {
        if ((updates as Record<string, unknown>)[field] !== undefined) {
            fields.push(`${field} = @${field}`);
            values[field] = (updates as Record<string, unknown>)[field];
        }
    }

    if (updates.status === 'called' || updates.attempt_count !== undefined) {
        fields.push('last_attempt_at = CURRENT_TIMESTAMP');
    }

    if (fields.length === 0) return current;

    const sql = `UPDATE call_queue SET ${fields.join(', ')} WHERE id = @id`;
    db.prepare(sql).run(values);

    return getCallQueueItemById(id);
}

export function removeFromCallQueue(id: number): boolean {
    const db = getDb();
    const result = db.prepare('DELETE FROM call_queue WHERE id = ?').run(id);
    return result.changes > 0;
}

// ============================================================
// ACTIVITY LOG FUNCTIONS
// ============================================================

export function logActivity(entityType: ActivityLogInsert['entity_type'], entityId: number, action: string, details?: Record<string, unknown>): void {
    const db = getDb();
    db.prepare(`
        INSERT INTO activity_log (entity_type, entity_id, action, details)
        VALUES (?, ?, ?, ?)
    `).run(entityType, entityId, action, toJson(details));
}

export function getActivityLog(options: {
    entity_type?: string;
    entity_id?: number;
    limit?: number;
}): ActivityLog[] {
    const db = getDb();
    const conditions: string[] = [];
    const params: Record<string, unknown> = {};

    if (options.entity_type) {
        conditions.push('entity_type = @entity_type');
        params.entity_type = options.entity_type;
    }
    if (options.entity_id !== undefined) {
        conditions.push('entity_id = @entity_id');
        params.entity_id = options.entity_id;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = options.limit ?? 100;

    const sql = `SELECT * FROM activity_log ${where} ORDER BY created_at DESC LIMIT @limit`;
    params.limit = limit;

    return db.prepare(sql).all(params) as ActivityLog[];
}

// ============================================================
// TRANSACTION SUPPORT
// ============================================================

export function withTransaction<T>(fn: (db: Database.Database) => T): T {
    const db = getDb();
    const transactionFn = db.transaction(fn);
    // Call the transaction function - better-sqlite3 handles passing db internally
    return (transactionFn as unknown as () => T)();
}

export function runTransaction(fn: (db: Database.Database) => void): void {
    const db = getDb();
    const transactionFn = db.transaction(fn);
    // Call the transaction function - better-sqlite3 handles passing db internally
    (transactionFn as unknown as () => void)();
}

// ============================================================
// STATISTICS
// ============================================================

export function getStats(): {
    totalLeads: number;
    leadsByStatus: Record<string, number>;
    leadsByDistrict: Record<string, number>;
    totalCalls: number;
    totalProposals: number;
    totalDeliveries: number;
    pendingCallQueue: number;
} {
    const db = getDb();

    const totalLeads = (db.prepare('SELECT COUNT(*) as cnt FROM leads').get() as { cnt: number }).cnt;

    const statusRows = db.prepare('SELECT status, COUNT(*) as cnt FROM leads GROUP BY status').all() as { status: string; cnt: number }[];
    const leadsByStatus: Record<string, number> = {};
    for (const row of statusRows) {
        leadsByStatus[row.status] = row.cnt;
    }

    const districtRows = db.prepare('SELECT district, COUNT(*) as cnt FROM leads WHERE district IS NOT NULL GROUP BY district').all() as { district: string; cnt: number }[];
    const leadsByDistrict: Record<string, number> = {};
    for (const row of districtRows) {
        leadsByDistrict[row.district] = row.cnt;
    }

    const totalCalls = (db.prepare('SELECT COUNT(*) as cnt FROM calls').get() as { cnt: number }).cnt;
    const totalProposals = (db.prepare('SELECT COUNT(*) as cnt FROM proposals').get() as { cnt: number }).cnt;
    const totalDeliveries = (db.prepare('SELECT COUNT(*) as cnt FROM deliveries').get() as { cnt: number }).cnt;
    const pendingCallQueue = (db.prepare("SELECT COUNT(*) as cnt FROM call_queue WHERE status = 'pending'").get() as { cnt: number }).cnt;

    return {
        totalLeads,
        leadsByStatus,
        leadsByDistrict,
        totalCalls,
        totalProposals,
        totalDeliveries,
        pendingCallQueue
    };
}
