
import { GoogleGenAI, Type } from "@google/genai";
import type { Hadith } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const fetchHadiths = async (): Promise<Hadith[]> => {
    try {
        const prompt = `Provide 10 authentic hadiths in Bengali (বাংলা) about the importance of prayer (সালাত) and fasting (রোজা). Format the response as a valid JSON array of objects. Each object must have two keys: "hadith" (the hadith text in Bengali) and "source" (the reference, e.g., 'Sahih al-Bukhari 1'). Do not include any text outside of the JSON array.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hadith: {
                      type: Type.STRING,
                      description: 'The hadith text in Bengali.',
                    },
                    source: {
                      type: Type.STRING,
                      description: 'The source of the hadith.',
                    },
                  },
                },
              },
            },
        });
        
        const jsonStr = response.text.trim();
        const hadiths: Hadith[] = JSON.parse(jsonStr);
        return hadiths;

    } catch (error) {
        console.error("Error fetching hadiths from Gemini API:", error);
        // Return a fallback hadith in case of API failure
        return [{
            hadith: "দুনিয়ার জীবনটা হচ্ছে আখেরাতের জন্য পরীক্ষার হল। এখানে প্রত্যেককে তার নিজ নিজ কর্মফল ভোগ করতে হবে।",
            source: "আল-কুরআন"
        }];
    }
};
