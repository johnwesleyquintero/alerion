export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
  OUT_OF_BUDGET = 'OUT_OF_BUDGET'
}

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  spend: number;
  sales: number;
  acos: number; // Advertising Cost of Sales %
  roas: number; // Return on Ad Spend
  impressions: number;
  clicks: number;
  ctr: number; // Click Through Rate %
}

export interface OptimizationSuggestion {
  campaignId: string;
  campaignName: string;
  suggestion: string;
  reasoning: string;
  suggestedAction: 'INCREASE_BID' | 'DECREASE_BID' | 'PAUSE_KEYWORD' | 'ADD_NEGATIVE';
  value?: number;
}

export interface ChartDataPoint {
  date: string;
  spend: number;
  sales: number;
  acos: number;
}
