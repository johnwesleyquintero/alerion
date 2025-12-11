import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Campaign, OptimizationSuggestion, OptimizationStrategy, MarketInsight, ExecutiveBriefing } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeCampaigns = async (campaigns: Campaign[], strategy: OptimizationStrategy): Promise<OptimizationSuggestion[]> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning mock analysis.");
    return mockAnalysis(campaigns);
  }

  let strategyContext = "";
  switch (strategy) {
    case 'PROFITABILITY':
      strategyContext = "Prioritize reducing ACOS aggressively. Suggest pausing keywords with ACOS > 30% and lowering bids on low ROAS campaigns. We are maximizing profit.";
      break;
    case 'GROWTH':
      strategyContext = "Prioritize Impressions and Sales volume. ACOS up to 45% is acceptable. Suggest increasing bids on high converting terms. We are in launch/ranking mode.";
      break;
    default:
      strategyContext = "Maintain a balance between Spend and Sales. Target ACOS around 30%. Optimize outliers.";
  }

  try {
    const prompt = `
      You are an expert Amazon Advertising Analyst. 
      Analyze the following campaign performance data and provide actionable optimization suggestions.
      
      CURRENT STRATEGY: ${strategyContext}
      
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

export const generateMarketInsights = async (campaigns: Campaign[]): Promise<MarketInsight[]> => {
  if (!apiKey) {
    return [
      { title: "Top Search Term", description: "Strong performance on 'ergonomic office chair'", sentiment: "POSITIVE", metric: "15% Conv" },
      { title: "Competitor Alert", description: "Brand X increased bids on core terms", sentiment: "NEGATIVE", metric: "High CPC" },
      { title: "Inventory Health", description: "98% In Stock - Ready for scale", sentiment: "NEUTRAL", metric: "Healthy" }
    ];
  }

  try {
    const prompt = `
      Analyze these Amazon campaigns. Provide 3 short, high-level market insights or alerts for the dashboard.
      Focus on trends, anomalies, or opportunities.
      Data: ${JSON.stringify(campaigns)}
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
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              sentiment: { type: Type.STRING, enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'] },
              metric: { type: Type.STRING, nullable: true }
            },
            required: ['title', 'description', 'sentiment']
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as MarketInsight[];
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Insight Gen Failed", error);
     return [
      { title: "API Error", description: "Could not generate live insights", sentiment: "NEUTRAL" }
    ];
  }
}

export const generateExecutiveBriefing = async (campaigns: Campaign[]): Promise<ExecutiveBriefing> => {
    if (!apiKey) {
        return {
            headline: "Performance Remains Stable",
            summary: "Campaigns are performing within expected KPIs. 'Kitchen Gadgets' continues to drive the majority of revenue.",
            actionItem: "Review bid caps on 'Auto - Discovery' to restart impressions."
        };
    }

    try {
        const prompt = `
          Act as a Chief Marketing Officer. Summarize the current Amazon Ads performance based on this data.
          Write a punchy headline, a 2-sentence summary, and 1 key strategic action item for today.
          Data: ${JSON.stringify(campaigns)}
        `;
    
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                summary: { type: Type.STRING },
                actionItem: { type: Type.STRING }
              },
              required: ['headline', 'summary', 'actionItem']
            }
          }
        });
    
        if (response.text) {
          return JSON.parse(response.text) as ExecutiveBriefing;
        }
        throw new Error("No briefing data returned");
      } catch (error) {
        console.error("Briefing Gen Failed", error);
         return {
            headline: "System Offline",
            summary: "Unable to generate real-time briefing. Please check API connectivity.",
            actionItem: "Check system logs."
        };
      }
};

export const createCampaignChat = (campaigns: Campaign[], strategy: OptimizationStrategy): Chat => {
  const systemContext = `
    You are 'Alerion', an advanced Amazon PPC AI Assistant.
    
    CURRENT STRATEGIC GOAL: ${strategy}
    (If Profitability: Focus on low ACOS. If Growth: Focus on Sales/Impressions. If Balanced: Focus on ROAS).

    You have access to the following live campaign data:
    ${JSON.stringify(campaigns)}

    Your goal is to answer questions about this specific data.
    - Be concise and strategic.
    - Use specific numbers from the data.
    - If a user asks for advice, refer to metrics like ACOS, ROAS, and CTR.
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemContext,
    },
  });
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