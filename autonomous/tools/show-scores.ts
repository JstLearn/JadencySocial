/**
 * Dijital Skor Görüntüleme
 *
 * Analiz edilmiş leadlerin dijital skorlarını gösterir.
 */

import { getLeads, getAnalysisByLeadId, getDb } from '../db/index.js';
import { calculateDigitalScore, buildProfileFromAnalysis } from './score.js';

interface LeadScore {
  id: number;
  business_name: string;
  website: string | null;
  district: string | null;
  business_type: string | null;
  totalScore: number;
  websiteScore: number;
  socialScore: number;
  reputationScore: number;
  infrastructureScore: number;
  tier: string;
  insights: string[];
  recommendations: string[];
}

async function main() {
  console.log('===========================================');
  console.log('[Dijital Skor Raporu]');
  console.log('===========================================\n');

  const db = getDb();

  // Get all leads with analysis
  const leads = getLeads({ limit: 500 });
  const scoredLeads: LeadScore[] = [];

  for (const lead of leads) {
    const analysis = getAnalysisByLeadId(lead.id);
    if (!analysis || analysis.website_score === null) continue;

    const profile = buildProfileFromAnalysis({
      website_score: analysis.website_score,
      seo_score: analysis.seo_score,
      social_score: analysis.social_score,
      content_score: analysis.content_score,
    });

    const result = calculateDigitalScore(profile);

    scoredLeads.push({
      id: lead.id,
      business_name: lead.business_name,
      website: lead.website,
      district: lead.district,
      business_type: lead.business_type,
      totalScore: result.totalScore,
      websiteScore: result.websiteScore,
      socialScore: result.socialScore,
      reputationScore: result.reputationScore,
      infrastructureScore: result.infrastructureScore,
      tier: result.tier,
      insights: result.insights,
      recommendations: result.recommendations,
    });
  }

  // Sort by total score
  scoredLeads.sort((a, b) => b.totalScore - a.totalScore);

  // Summary by tier
  const tierCounts = { premium: 0, active: 0, basic: 0, none: 0 };
  for (const lead of scoredLeads) {
    tierCounts[lead.tier as keyof typeof tierCounts]++;
  }

  console.log('=== ÖZET ===');
  console.log(`Toplam skorlanan: ${scoredLeads.length}`);
  console.log(`Premium (70+): ${tierCounts.premium}`);
  console.log(`Active (45-69): ${tierCounts.active}`);
  console.log(`Basic (20-44): ${tierCounts.basic}`);
  console.log(`None (0-19): ${tierCounts.none}`);
  console.log('');

  // Show top leads by tier
  console.log('=== PREMIUM LEADLER (70+ puan) ===');
  const premiumLeads = scoredLeads.filter(l => l.tier === 'premium');
  if (premiumLeads.length === 0) {
    console.log('( yok)');
  } else {
    for (const lead of premiumLeads.slice(0, 10)) {
      console.log(`\n📍 ${lead.business_name}`);
      console.log(`   İlçe: ${lead.district} | Tip: ${lead.business_type}`);
      console.log(`   Web: ${lead.website}`);
      console.log(`   Skor: ${lead.totalScore}/100`);
      console.log(`   Website: ${lead.websiteScore}/30 | Sosyal: ${lead.socialScore}/25 | İtibar: ${lead.reputationScore}/25 | Altyapı: ${lead.infrastructureScore}/20`);
      if (lead.insights.length > 0) {
        console.log(`   📝 ${lead.insights.join(' | ')}`);
      }
      if (lead.recommendations.length > 0) {
        console.log(`   💡 ${lead.recommendations.slice(0, 2).join(' | ')}`);
      }
    }
  }

  console.log('\n=== ACTIVE LEADLER (45-69 puan) ===');
  const activeLeads = scoredLeads.filter(l => l.tier === 'active');
  if (activeLeads.length === 0) {
    console.log('( yok)');
  } else {
    for (const lead of activeLeads.slice(0, 10)) {
      console.log(`\n📍 ${lead.business_name}`);
      console.log(`   İlçe: ${lead.district} | Tip: ${lead.business_type}`);
      console.log(`   Skor: ${lead.totalScore}/100 [Website:${lead.websiteScore} Sosyal:${lead.socialScore} İtibar:${lead.reputationScore} Altyapı:${lead.infrastructureScore}]`);
      if (lead.recommendations.length > 0) {
        console.log(`   💡 ${lead.recommendations.slice(0, 2).join(' | ')}`);
      }
    }
  }

  console.log('\n=== ÖNCELEMLİ STOKLAR (web sitesi yok veya zayıf) ===');
  const noWebsiteLeads = getLeads({ limit: 500 }).filter(l => !l.website || l.website.trim() === '');
  const noWebsiteAnalyzed = noWebsiteLeads.filter(l => {
    const a = getAnalysisByLeadId(l.id);
    return a === null || a.website_score === null;
  });

  console.log(`\nToplam web sitesi olmayan: ${noWebsiteLeads.length}`);
  console.log(`Henüz analiz edilmemiş: ${noWebsiteAnalyzed.length}`);

  if (noWebsiteAnalyzed.length > 0) {
    console.log('\nİlk 10 (öncelik sırasına göre):');
    for (const lead of noWebsiteAnalyzed.slice(0, 10)) {
      console.log(`• ${lead.business_name} | ${lead.district} | ${lead.business_type}`);
    }
  }

  console.log('\n===========================================');
  console.log('Tam liste için veritabanını sorgula.');
  console.log('===========================================');
}

main().catch(console.error);
