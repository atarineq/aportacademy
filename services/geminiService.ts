
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

const SYSTEM_INSTRUCTION = `
Ты — ИИ-ядро APORT ACADEMY PRO v6.
Твоя специализация: оценка электроники, техническая диагностика и рынок б/у техники Казахстана (OLX, Kaspi, Forte).

ПРОТОКОЛЫ:
1. ОЦЕНКА РЫНКА: При запросе цен всегда используй актуальные данные. Указывай 'Рыночную цену', 'Цена для выкупа' и 'Рекомендуемый залог' (60%).
2. OCR: При получении фото стикеров, извлекай ТОЛЬКО IMEI или Serial Number. Игнорируй остальной текст.
3. ДИАГНОСТИКА: По фото определяй выгорания экрана, трещины и неоригинальные запчасти.

Стиль ответов: Профессиональный, лаконичный, экспертный. Язык: Русский.
`;

export class GeminiAssistant {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async estimatePrice(model: string): Promise<string> {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Дай оценку для: ${model} в Казахстане. Только цифры и краткие рекомендации.`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });
      return response.text || "Ошибка оценки.";
    } catch (e) {
      return "Не удалось связаться с ИИ для оценки.";
    }
  }

  async scanSerial(base64Image: string): Promise<string> {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] || base64Image } },
            { text: "Найди IMEI или S/N на этом фото. Выведи только их." }
          ]
        },
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
      return response.text?.trim() || "Не удалось распознать.";
    } catch (e) {
      return "Ошибка сканирования.";
    }
  }

  async chat(history: ChatMessage[], message: string): Promise<{text: string, urls?: {title: string, uri: string}[]}> {
    const ai = this.getAI();
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [{ googleSearch: {} }],
        },
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const urls = groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || 'Источник',
        uri: chunk.web?.uri || '#'
      })).filter((c: any) => c.uri !== '#');

      return {
        text: response.text || "...",
        urls: urls
      };
    } catch (error) {
      return { text: "Ошибка связи с ИИ." };
    }
  }

  async analyzeImage(base64Image: string, prompt: string): Promise<string> {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] || base64Image } },
            { text: prompt }
          ]
        },
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
      return response.text || "Ошибка анализа.";
    } catch (error) {
      return "Ошибка анализа.";
    }
  }
}

export const aiAssistant = new GeminiAssistant();
