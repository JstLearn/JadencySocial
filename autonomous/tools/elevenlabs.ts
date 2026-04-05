/**
 * ElevenLabs Tool
 *
 * Text-to-Speech integration for:
 * - Audio content creation
 * - Voice-overs for videos
 * - IVR and phone systems
 * - Audio notifications
 */

import axios from 'axios';
import { z } from 'zod';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1';

export const VoiceSchema = z.object({
  voice_id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string().optional(),
  labels: z.record(z.string()).optional(),
  preview_url: z.string().optional(),
  available_for_tiers: z.array(z.string()).optional(),
  settings: z.object({
    stability: z.number(),
    similarity_boost: z.number(),
    style: z.number().optional(),
    use_speaker_boost: z.boolean().optional(),
  }).optional(),
});

export const TextToSpeechRequestSchema = z.object({
  text: z.string().min(1).max(5000),
  voice_id: z.string(),
  model_id: z.string().optional().default('eleven_monolingual_v1'),
  voice_settings: z.object({
    stability: z.number().min(0).max(1).optional(),
    similarity_boost: z.number().min(0).max(1).optional(),
    style: z.number().min(0).max(1).optional(),
    use_speaker_boost: z.boolean().optional(),
  }).optional(),
});

export const TextToSpeechResponseSchema = z.object({
  audio_base64: z.string().optional(),
  audio: z.string().optional(),
});

export type Voice = z.infer<typeof VoiceSchema>;
export type TextToSpeechRequest = z.infer<typeof TextToSpeechRequestSchema>;

const apiClient = axios.create({
  baseURL: ELEVENLABS_BASE_URL,
  headers: {
    'xi-api-key': ELEVENLABS_API_KEY,
    'Content-Type': 'application/json',
  },
});

// Turkish voice presets
export const TURKISH_VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', gender: 'female', lang: 'en' },
  { id: '29vDJs7MFHZUaPE17QhK', name: 'Domi', gender: 'female', lang: 'en' },
  { id: 'ZB4DHiw04POtJhsKRjVd', name: 'Fin', gender: 'male', lang: 'en' },
];

export interface VoiceSettings {
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
}

/**
 * List available voices
 */
export async function listVoices(): Promise<Voice[]> {
  try {
    const response = await apiClient.get('/voices');
    return response.data.voices;
  } catch (error) {
    console.error('Error listing voices:', error);
    throw error;
  }
}

/**
 * Get a specific voice by ID
 */
export async function getVoice(voiceId: string): Promise<Voice> {
  try {
    const response = await apiClient.get(`/voices/${voiceId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting voice:', error);
    throw error;
  }
}

/**
 * Text to Speech - returns audio buffer
 */
export async function textToSpeech(
  text: string,
  voiceId: string,
  options: {
    modelId?: string;
    voiceSettings?: VoiceSettings;
    outputPath?: string;
  } = {}
): Promise<Buffer> {
  const { modelId = 'eleven_monolingual_v1', voiceSettings, outputPath } = options;

  const requestBody: Record<string, unknown> = {
    text,
    voice_settings: voiceSettings || {
      stability: 0.5,
      similarity_boost: 0.75,
    },
  };

  if (modelId) {
    requestBody.model_id = modelId;
  }

  try {
    const response = await apiClient.post(
      `/text-to-speech/${voiceId}`,
      requestBody,
      { responseType: 'arraybuffer' }
    );

    const audioBuffer = Buffer.from(response.data);

    // Save to file if path provided
    if (outputPath) {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, audioBuffer);
    }

    return audioBuffer;
  } catch (error) {
    console.error('Error converting text to speech:', error);
    throw error;
  }
}

/**
 * Text to Speech Streaming - for longer texts
 */
export async function textToSpeechStream(
  text: string,
  voiceId: string,
  options: {
    modelId?: string;
    voiceSettings?: VoiceSettings;
  } = {}
): Promise<NodeJS.ReadableStream> {
  const { modelId = 'eleven_monolingual_v1', voiceSettings } = options;

  const requestBody: Record<string, unknown> = {
    text,
    voice_settings: voiceSettings || {
      stability: 0.5,
      similarity_boost: 0.75,
    },
  };

  if (modelId) {
    requestBody.model_id = modelId;
  }

  try {
    const response = await apiClient.post(
      `/text-to-speech/${voiceId}/stream`,
      requestBody,
      { responseType: 'stream' }
    );

    return response.data;
  } catch (error) {
    console.error('Error streaming text to speech:', error);
    throw error;
  }
}

/**
 * Get remaining character quota
 */
export async function getRemainingQuota(): Promise<{
  character_limit: number;
  character_count: number;
  can_extend_character_limit: boolean;
}> {
  try {
    const response = await apiClient.get('/user/subscription');
    return {
      character_limit: response.data.character_limit,
      character_count: response.data.character_count,
      can_extend_character_limit: response.data.can_extend_character_limit,
    };
  } catch (error) {
    console.error('Error getting quota:', error);
    throw error;
  }
}

/**
 * Generate audio for an announcement/message
 * Returns path to generated audio file
 */
export async function generateAnnouncement(
  message: string,
  outputDir: string,
  options: {
    voiceId?: string;
    voiceName?: string;
  } = {}
): Promise<string> {
  const { voiceId, voiceName = 'default' } = options;

  // Use specified voice or default Turkish voice
  const selectedVoiceId = voiceId || TURKISH_VOICES[0].id;

  const timestamp = Date.now();
  const filename = `announcement_${voiceName}_${timestamp}.mp3`;
  const outputPath = path.join(outputDir, filename);

  await textToSpeech(message, selectedVoiceId, { outputPath });

  return outputPath;
}

/**
 * Generate audio for multiple messages (batch)
 */
export async function generateBatchAudio(
  messages: { text: string; filename: string }[],
  outputDir: string,
  options: {
    voiceId?: string;
  } = {}
): Promise<string[]> {
  const { voiceId } = options;
  const selectedVoiceId = voiceId || TURKISH_VOICES[0].id;

  const outputPaths: string[] = [];

  for (const msg of messages) {
    const outputPath = path.join(outputDir, msg.filename);
    await textToSpeech(msg.text, selectedVoiceId, { outputPath });
    outputPaths.push(outputPath);
  }

  return outputPaths;
}

/**
 * Create SSML-powered speech
 */
export async function ssmlToSpeech(
  ssml: string,
  voiceId: string,
  options: {
    modelId?: string;
    outputPath?: string;
  } = {}
): Promise<Buffer> {
  const { modelId = 'eleven_multilingual_v2', outputPath } = options;

  try {
    const response = await apiClient.post(
      `/text-to-speech/${voiceId}`,
      {
        text: ssml,
        model_id: modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      { responseType: 'arraybuffer' }
    );

    const audioBuffer = Buffer.from(response.data);

    if (outputPath) {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, audioBuffer);
    }

    return audioBuffer;
  } catch (error) {
    console.error('Error converting SSML to speech:', error);
    throw error;
  }
}

export default {
  listVoices,
  getVoice,
  textToSpeech,
  textToSpeechStream,
  getRemainingQuota,
  generateAnnouncement,
  generateBatchAudio,
  ssmlToSpeech,
  TURKISH_VOICES,
};
