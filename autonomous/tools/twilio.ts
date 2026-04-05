/**
 * Twilio Tool
 *
 * SMS and WhatsApp messaging integration for:
 * - Outbound SMS notifications
 * - WhatsApp business messaging
 * - Voice call handling
 * - Two-way messaging
 */

import twilio from 'twilio';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const PhoneNumberSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export const SMSMessageSchema = z.object({
  to: PhoneNumberSchema,
  body: z.string().min(1).max(1600),
  from: z.string().optional(),
});

export const WhatsAppMessageSchema = z.object({
  to: PhoneNumberSchema,
  body: z.string().min(1).max(4096),
  mediaUrl: z.string().url().optional(),
  from: z.string().optional(),
});

export const CallRequestSchema = z.object({
  to: PhoneNumberSchema,
  url: z.string().url().optional(), // TwiML URL for call flow
  from: z.string().optional(),
  timeout: z.number().optional().default(30),
  statusCallback: z.string().url().optional(),
});

export type SMSMessage = z.infer<typeof SMSMessageSchema>;
export type WhatsAppMessage = z.infer<typeof WhatsAppMessageSchema>;
export type CallRequest = z.infer<typeof CallRequestSchema>;

// Turkish phone number validation
const TURKISH_MOBILE_PREFIXES = [
  '0505', '0506', '0507', '0531', '0532', '0533', '0534', '0535', '0536', '0537',
  '0538', '0539', '0540', '0541', '0542', '0543', '0544', '0545', '0546', '0547',
  '0548', '0549', '0551', '0552', '0553', '0554', '0555', '0556', '0557', '0558',
  '0559', '0595', '0599',
];

/**
 * Format Turkish phone number to E.164 format
 */
export function formatTurkishPhone(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If starts with 0, replace with +90
  if (digits.startsWith('0')) {
    return '+90' + digits.slice(1);
  }

  // If starts with 90, add +
  if (digits.startsWith('90')) {
    return '+' + digits;
  }

  // If 10 digits (Turkish mobile), add +90
  if (digits.length === 10) {
    return '+90' + digits;
  }

  // If 11 digits starting with 0, add +
  if (digits.length === 11 && digits.startsWith('0')) {
    return '+' + digits;
  }

  // Already formatted or international
  return digits.startsWith('+') ? digits : '+' + digits;
}

/**
 * Validate Turkish phone number
 */
export function isValidTurkishPhone(phone: string): boolean {
  const formatted = formatTurkishPhone(phone);
  const digits = formatted.replace(/\D/g, '');

  if (digits.length !== 12) return false;
  if (!digits.startsWith('90')) return false;

  const prefix = digits.slice(2, 6);
  return TURKISH_MOBILE_PREFIXES.some(p => prefix.startsWith(p.slice(0, 3)));
}

/**
 * Send SMS message
 */
export async function sendSMS(message: SMSMessage): Promise<{
  sid: string;
  status: string;
  to: string;
  from: string;
  dateCreated: Date;
}> {
  const validated = SMSMessageSchema.parse(message);

  try {
    const result = await client.messages.create({
      to: validated.to,
      body: validated.body,
      from: validated.from || TWILIO_PHONE_NUMBER,
    });

    return {
      sid: result.sid,
      status: result.status,
      to: result.to,
      from: result.from,
      dateCreated: result.dateCreated,
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

/**
 * Send WhatsApp message
 */
export async function sendWhatsApp(message: WhatsAppMessage): Promise<{
  sid: string;
  status: string;
  to: string;
  from: string;
  dateCreated: Date;
}> {
  const validated = WhatsAppMessageSchema.parse(message);

  try {
    const result = await client.messages.create({
      to: 'whatsapp:' + validated.to,
      body: validated.body,
      mediaUrl: validated.mediaUrl ? [validated.mediaUrl] : undefined,
      from: 'whatsapp:' + (validated.from || TWILIO_PHONE_NUMBER),
    });

    return {
      sid: result.sid,
      status: result.status,
      to: result.to,
      from: result.from,
      dateCreated: result.dateCreated,
    };
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    throw error;
  }
}

/**
 * Make voice call
 */
export async function makeCall(call: CallRequest): Promise<{
  sid: string;
  status: string;
  to: string;
  from: string;
}> {
  const validated = CallRequestSchema.parse(call);

  try {
    const result = await client.calls.create({
      to: validated.to,
      from: validated.from || TWILIO_PHONE_NUMBER,
      url: validated.url,
      timeout: validated.timeout,
      statusCallback: validated.statusCallback,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    });

    return {
      sid: result.sid,
      status: result.status,
      to: result.to,
      from: result.from,
    };
  } catch (error) {
    console.error('Error making call:', error);
    throw error;
  }
}

/**
 * Get message status
 */
export async function getMessageStatus(messageSid: string): Promise<{
  sid: string;
  status: string;
  errorCode: number | null;
  errorMessage: string | null;
}> {
  try {
    const message = await client.messages(messageSid).fetch();

    return {
      sid: message.sid,
      status: message.status,
      errorCode: message.errorCode || null,
      errorMessage: message.errorMessage || null,
    };
  } catch (error) {
    console.error('Error getting message status:', error);
    throw error;
  }
}

/**
 * Get call status
 */
export async function getCallStatus(callSid: string): Promise<{
  sid: string;
  status: string;
  duration: number | null;
  startTime: Date | null;
  endTime: Date | null;
}> {
  try {
    const call = await client.calls(callSid).fetch();

    return {
      sid: call.sid,
      status: call.status,
      duration: call.duration ? parseInt(call.duration, 10) : null,
      startTime: call.startTime || null,
      endTime: call.endTime || null,
    };
  } catch (error) {
    console.error('Error getting call status:', error);
    throw error;
  }
}

/**
 * Cancel an outgoing call
 */
export async function cancelCall(callSid: string): Promise<boolean> {
  try {
    await client.calls(callSid).update({ status: 'canceled' });
    return true;
  } catch (error) {
    console.error('Error canceling call:', error);
    return false;
  }
}

// Pre-built message templates
export const MESSAGE_TEMPLATES = {
  leadNotification: (businessName: string, phone: string) =>
    `Merhaba! Jadency Social'dan yeni bir potansiyel müşteri bulduk: ${businessName}. İletisim: ${phone}`,

  followUp: (businessName: string) =>
    `Merhaba ${businessName}! Sosyal medya pazarlamasi hakkinda kisa bir gorusme ayarlayabilir miyiz?`,

  proposalSent: (businessName: string) =>
    `${businessName} icin hazirladigimiz sosyal medya teklifimiz gonderildi. Sorulariniz icin asagidaki numaradan ulasabilirsiniz.`,

  meetingReminder: (businessName: string, dateTime: string) =>
    `Yarin saat ${dateTime}'de ${businessName} ile toplantimiz var. Katiliminizi onaylar misiniz?`,

  paymentReminder: (amount: number, dueDate: string) =>
    `Sosyal medya hizmet bedeli ${amount} TL, son odeme tarihi: ${dueDate}. Lutfen zamaninda odeme yapiniz.`,
};

export default {
  sendSMS,
  sendWhatsApp,
  makeCall,
  getMessageStatus,
  getCallStatus,
  cancelCall,
  formatTurkishPhone,
  isValidTurkishPhone,
  MESSAGE_TEMPLATES,
};
