import Database from 'better-sqlite3';
import path from 'path';
import {
  sendMessage,
  sendDailySummary,
  notifyError,
  type DailySummary,
} from '../tools/telegram.js';

const DB_PATH = path.join(__dirname, '../../db/jadencysocial.db');

function getDb(): Database.Database {
  return new Database(DB_PATH, { readonly: true });
}

interface WeeklyStats {
  period: string;
  newLeads: number;
  analyzed: number;
  highPriority: number;
  called: number;
  proposalsSent: number;
  paymentsReceived: number;
  revenue: number;
  deliveriesCompleted: number;
  topDistricts: { district: string; count: number }[];
  topBusinessTypes: { type: string; count: number }[];
  avgAnalysisScore: number;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function getWeekRange(weeksAgo = 0): { start: string; end: string } {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - (7 * weeksAgo) - now.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return { start: fmt(weekStart), end: fmt(weekEnd) };
}

function fetchWeeklyStats(db: Database.Database, start: string, end: string): WeeklyStats {
  const newLeads = db
    .prepare(`SELECT COUNT(*) as c FROM leads WHERE date(created_at) BETWEEN ? AND ?`)
    .get(start, end) as { c: number };

  const analyzed = db
    .prepare(`SELECT COUNT(*) as c FROM analysis WHERE date(analyzed_at) BETWEEN ? AND ?`)
    .get(start, end) as { c: number };

  const highPriority = db
    .prepare(
      `SELECT COUNT(*) as c FROM analysis
       WHERE date(analyzed_at) BETWEEN ? AND ?
       AND overall_score >= 75`
    )
    .get(start, end) as { c: number };

  const called = db
    .prepare(
      `SELECT COUNT(*) as c FROM calls
       WHERE date(called_at) BETWEEN ? AND ?
       AND status = 'completed'`
    )
    .get(start, end) as { c: number };

  const proposalsSent = db
    .prepare(
      `SELECT COUNT(*) as c FROM proposals
       WHERE date(created_at) BETWEEN ? AND ?`
    )
    .get(start, end) as { c: number };

  const paymentsReceived = db
    .prepare(
      `SELECT COUNT(*) as c FROM proposals
       WHERE date(paid_at) BETWEEN ? AND ?
       AND status = 'paid'`
    )
    .get(start, end) as { c: number };

  const revenue = db
    .prepare(
      `SELECT COALESCE(SUM(total_price), 0) as total FROM proposals
       WHERE date(paid_at) BETWEEN ? AND ?
       AND status = 'paid'`
    )
    .get(start, end) as { total: number };

  const deliveriesCompleted = db
    .prepare(
      `SELECT COUNT(*) as c FROM deliveries
       WHERE date(completed_at) BETWEEN ? AND ?
       AND status = 'delivered'`
    )
    .get(start, end) as { c: number };

  const topDistricts = db
    .prepare(
      `SELECT district, COUNT(*) as count
       FROM leads
       WHERE date(created_at) BETWEEN ? AND ?
       GROUP BY district
       ORDER BY count DESC
       LIMIT 5`
    )
    .all(start, end) as { district: string; count: number }[];

  const topBusinessTypes = db
    .prepare(
      `SELECT business_type, COUNT(*) as count
       FROM leads
       WHERE date(created_at) BETWEEN ? AND ?
         AND business_type IS NOT NULL
       GROUP BY business_type
       ORDER BY count DESC
       LIMIT 5`
    )
    .all(start, end) as { type: string; count: number }[];

  const avgScore = db
    .prepare(
      `SELECT COALESCE(AVG(overall_score), 0) as avg FROM analysis
       WHERE date(analyzed_at) BETWEEN ? AND ?`
    )
    .get(start, end) as { avg: number };

  return {
    period: `${start} — ${end}`,
    newLeads: newLeads.c,
    analyzed: analyzed.c,
    highPriority: highPriority.c,
    called: called.c,
    proposalsSent: proposalsSent.c,
    paymentsReceived: paymentsReceived.c,
    revenue: revenue.total,
    deliveriesCompleted: deliveriesCompleted.c,
    topDistricts,
    topBusinessTypes,
    avgAnalysisScore: Math.round(avgScore.avg * 10) / 10,
  };
}

function fetchDailySummary(db: Database.Database): DailySummary {
  const today = new Date().toISOString().split('T')[0];

  const newLeads = (db
    .prepare(`SELECT COUNT(*) as c FROM leads WHERE date(created_at) = ?`)
    .get(today) as { c: number }).c;

  const analyzed = (db
    .prepare(`SELECT COUNT(*) as c FROM analysis WHERE date(analyzed_at) = ?`)
    .get(today) as { c: number }).c;

  const highPriority = (db
    .prepare(
      `SELECT COUNT(*) as c FROM analysis WHERE date(analyzed_at) = ? AND overall_score >= 75`
    )
    .get(today) as { c: number }).c;

  const called = (db
    .prepare(
      `SELECT COUNT(*) as c FROM calls WHERE date(called_at) = ? AND status = 'completed'`
    )
    .get(today) as { c: number }).c;

  const proposalsSent = (db
    .prepare(`SELECT COUNT(*) as c FROM proposals WHERE date(created_at) = ?`)
    .get(today) as { c: number }).c;

  const paymentsReceived = (db
    .prepare(`SELECT COUNT(*) as c FROM proposals WHERE date(paid_at) = ? AND status = 'paid'`)
    .get(today) as { c: number }).c;

  const revenue = (db
    .prepare(`SELECT COALESCE(SUM(total_price), 0) as total FROM proposals WHERE date(paid_at) = ? AND status = 'paid'`)
    .get(today) as { total: number }).total;

  const deliveriesCompleted = (db
    .prepare(`SELECT COUNT(*) as c FROM deliveries WHERE date(completed_at) = ? AND status = 'delivered'`)
    .get(today) as { c: number }).c;

  return {
    date: formatDate(new Date(today + 'T00:00:00')),
    newLeads,
    analyzed,
    highPriority,
    called,
    proposalsSent,
    paymentsReceived,
    revenue,
    deliveriesCompleted,
  };
}

function buildWeeklyReport(stats: WeeklyStats): string {
  const {
    period, newLeads, analyzed, highPriority,
    called, proposalsSent, paymentsReceived,
    revenue, deliveriesCompleted,
    topDistricts, topBusinessTypes, avgAnalysisScore,
  } = stats;

  const lines: string[] = [
    `📊 *Haftalik Rapor — ${period}*`,
    '',
    `━━━━━━━━━━━━━━`,
    `🔍 Yeni Lead        : *${newLeads}*`,
    `📋 Analiz           : *${analyzed}*${highPriority > 0 ? ` (${highPriority} yuksek)` : ''}`,
    `📞 Arama            : *${called}*`,
    `📤 Teklif           : *${proposalsSent}*`,
    `💳 Odeme            : *${paymentsReceived}*`,
    `💵 Ciro             : *${revenue.toLocaleString('tr-TR')} TRY*`,
    `🚀 Teslimat         : *${deliveriesCompleted}*`,
    '',
    `📈 Ort. Analiz Skoru: *${avgAnalysisScore}/100*`,
    '',
  ];

  if (topDistricts.length > 0) {
    lines.push('🏙️ *En Cok Lead Alan Ilceler*');
    for (const d of topDistricts) {
      lines.push(`  ${d.district || '(belirsiz)'} : *${d.count}*`);
    }
    lines.push('');
  }

  if (topBusinessTypes.length > 0) {
    lines.push('🏷️ *Is Turu Dagilimi*');
    for (const bt of topBusinessTypes) {
      lines.push(`  ${bt.type || '(belirsiz)'} : *${bt.count}*`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  const reportType = args[0] || 'daily';

  try {
    const db = getDb();

    if (reportType === 'weekly') {
      const { start, end } = getWeekRange(0);
      const stats = fetchWeeklyStats(db, start, end);
      const report = buildWeeklyReport(stats);
      await sendMessage(report);
    } else if (reportType === 'daily') {
      const summary = fetchDailySummary(db);
      await sendDailySummary(summary);
    } else {
      console.error(`Unknown report type: ${reportType}. Use: daily | weekly`);
      process.exit(1);
    }

    db.close();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[Reporter] Error: ${message}`);
    await notifyError('reporter', message);
    process.exit(1);
  }
}

main();