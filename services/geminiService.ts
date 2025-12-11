import { GoogleGenAI, Type } from "@google/genai";
import { Campaign, OptimizationSuggestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeCampaigns = async (campaigns: Campaign[]): Promise<OptimizationSuggestion[]> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning mock analysis.");
    return mockAnalysis(campaigns);
  }

  try {
    const prompt = `
      You are an expert Amazon Advertising Analyst. 
      Analyze the following campaign performance data and provide actionable optimization suggestions.
      Focus on reducing ACOS and increasing ROAS.
      
      Campaign Data:
      ${JSON.stringify(campaigns)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              campaignId: { type: Type.STRING },
              campaignName: { type: Type.STRING },
              suggestion: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              suggestedAction: { type: Type.STRING, enum: ['INCREASE_BID', 'DECREASE_BID', 'PAUSE_KEYWORD', 'ADD_NEGATIVE'] },
              value: { type: Type.NUMBER, nullable: true }
            },
            required: ['campaignId', 'campaignName', 'suggestion', 'reasoning', 'suggestedAction']
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as OptimizationSuggestion[];
    }
    throw new Error("No data returned from Gemini");

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return mockAnalysis(campaigns);
  }
};

// Fallback for demo purposes if API key is invalid/missing
const mockAnalysis = (campaigns: Campaign[]): OptimizationSuggestion[] => {
  return campaigns.map(c => {
    if (c.acos > 30) {
      return {
        campaignId: c.id,
        campaignName: c.name,
        suggestion: "High ACOS detected. Reduce bids on underperforming keywords.",
        reasoning: `ACOS is at ${c.acos.toFixed(2)}%, which is above the 30% target.`,
        suggestedAction: 'DECREASE_BID',
        value: 0.15
      };
    } else {
      return {
        campaignId: c.id,
        campaignName: c.name,
        suggestion: "Strong performance. Increase budget to scale.",
        reasoning: `ROAS is healthy at ${c.roas.toFixed(2)}. Opportunity to capture more traffic.`,
        suggestedAction: 'INCREASE_BID',
        value: 0.20
      };
    }
  });
};
