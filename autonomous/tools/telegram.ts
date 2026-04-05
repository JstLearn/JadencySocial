import axios from 'axios';
import * as fs from 'fs';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export interface DailySummary {
  date: string;
  newLeads: number;
  analyzed: number;
  highPriority: number;
  called: number;
  proposalsSent: number;
  paymentsReceived: number;
  revenue: number;
  deliveriesCompleted: number;
}

async function sendRequest(method: string, payload: Record<string, unknown>) {
  const response = await axios.post(`${BASE_URL}/${method}`, payload);
  return response.data;
}

export async function sendMessage(text: string, parseMode = 'Markdown'): Promise<boolean> {
  try {
    const result = await sendRequest('sendMessage', {
      chat_id: CHAT_ID,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: true,
    });
    return result.ok === true;
  } catch (err) {
    console.error(`[Telegram] Failed to send message: ${err}`);
    return false;
  }
}

export async function sendPhoto(photoPath: string, caption: string): Promise<boolean> {
  try {
    const FormData = (await import('form-data')).default;
    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('photo', fs.createReadStream(photoPath));
    form.append('caption', caption);
    form.append('parse_mode', 'Markdown');

    const response = await axios.post(`${BASE_URL}/sendPhoto`, form, {
      headers: form.getHeaders(),
    });
    return response.data.ok === true;
  } catch (err) {
    console.error(`[Telegram] Failed to send photo: ${err}`);
    return false;
  }
}

export async function sendDocument(docPath: string, caption: string): Promise<boolean> {
  try {
    const FormData = (await import('form-data')).default;
    const form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('document', fs.createReadStream(docPath));
    form.append('caption', caption);
    form.append('parse_mode', 'Markdown');

    const response = await axios.post(`${BASE_URL}/sendDocument`, form, {
      headers: form.getHeaders(),
    });
    return response.data.ok === true;
  } catch (err) {
    console.error(`[Telegram] Failed to send document: ${err}`);
    return false;
  }
}

export async function notifyScoutComplete(newLeads: number, errors: string[]): Promise<void> {
  let msg = `✅ *Scout Tamamlandi*\n\nYeni lead: *${newLeads}*`;
  if (errors.length > 0) {
    msg += `\n\n⚠️ Hatalar (${errors.length}):\n${errors.slice(0, 5).map(e => `  • ${e}`).join('\n')}`;
    if (errors.length > 5) msg += `\n  ...ve ${errors.length - 5} daha`;
  }
  await sendMessage(msg);
}

export async function notifyAnalysisComplete(analyzed: number, highPriority: number): Promise<void> {
  const emoji = highPriority > 0 ? '🔴' : '✅';
  await sendMessage(
    `${emoji} *Analiz Tamamlandi*\n\nAnaliz edilen: *${analyzed}*\nYuksek öncelikli: *${highPriority}*`
  );
}

export async function notifyCallComplete(businessName: string, interest: string): Promise<void> {
  const level = interest === 'high' ? '🟢' : interest === 'medium' ? '🟡' : '🔴';
  await sendMessage(
    `${level} *Arama Tamamlandi*\n\nIsletme: *${businessName}*\nIlgi: *${interest.toUpperCase()}*`
  );
}

export async function notifyProposalSent(businessName: string, amount: number): Promise<void> {
  await sendMessage(
    `📤 *Teklif Gonderildi*\n\nIsletme: *${businessName}*\nTutar: *${amount.toLocaleString('tr-TR')} TRY*`
  );
}

export async function notifyPaymentReceived(businessName: string, amount: number): Promise<void> {
  await sendMessage(
    `💰 *Odeme Alindi*\n\nIsletme: *${businessName}*\nTutar: *${amount.toLocaleString('tr-TR')} TRY*`
  );
}

export async function notifyDeliveryComplete(businessName: string, url: string): Promise<void> {
  await sendMessage(
    `🚀 *Teslimat Tamamlandi*\n\nIsletme: *${businessName}*\nURL: ${url}`
  );
}

export async function notifyError(context: string, error: string): Promise<void> {
  await sendMessage(
    `❌ *Hata — ${context}*\n\n\`\`\`\n${error.slice(0, 300)}\n\`\`\``
  );
}

export async function sendDailySummary(summary: DailySummary): Promise<void> {
  const {
    date, newLeads, analyzed, highPriority,
    called, proposalsSent, paymentsReceived,
    revenue, deliveriesCompleted,
  } = summary;

  const lines = [
    `📊 *Gunluk Ozet — ${date}*`,
    '',
    `🔍 Yeni Lead     : *${newLeads}*`,
    `📋 Analiz Edilen : *${analyzed}*  ${highPriority > 0 ? `(${highPriority} yuksek oncelikli)` : ''}`,
    `📞 Arama Yapildi : *${called}*`,
    `📤 Teklif Gonderildi: *${proposalsSent}*`,
    `💳 Odeme Alindi  : *${paymentsReceived}*`,
    '',
    `💵 Ciro          : *${revenue.toLocaleString('tr-TR')} TRY*`,
    `🚀 Teslimat      : *${deliveriesCompleted}*`,
  ];

  await sendMessage(lines.join('\n'));
}