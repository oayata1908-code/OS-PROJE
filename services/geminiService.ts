
import { GoogleGenAI, Modality } from "@google/genai";
import { GroundingSource } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function askGeminiWithSearch(prompt: string, context: string): Promise<{ text: string, sources: GroundingSource[] }> {
    const fullPrompt = `
        Aşağıdaki belge içeriğini ve kendi internet arama sonuçlarını kullanarak kullanıcının sorusunu cevapla.
        Cevapların net, bilgilendirici ve Türkçe olmalı. Sadece belge içeriğiyle sınırlı kalma, güncel ve doğru bilgi sağlamak için internet araması yap.
        
        Belge İçeriği:
        ---
        ${context}
        ---

        Kullanıcı Sorusu: ${prompt}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        let sources: GroundingSource[] = [];
        if (rawChunks) {
            sources = rawChunks
                .filter((chunk: any) => chunk.web && chunk.web.uri && chunk.web.title)
                .map((chunk: any) => ({
                    uri: chunk.web.uri,
                    title: chunk.web.title,
                }));
        }

        return { text, sources };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get response from Gemini API.");
    }
}

export async function generateSpeech(text: string): Promise<string | null> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("Error generating speech:", error);
        throw new Error("Failed to generate speech from Gemini API.");
    }
}
