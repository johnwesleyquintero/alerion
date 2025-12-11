import { Campaign, CampaignStatus, ChartDataPoint } from './types';

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp_1',
    name: 'Summer Essentials - Broad',
    status: CampaignStatus.ACTIVE,
    budget: 50.00,
    spend: 1245.50,
    sales: 4500.00,
    acos: 27.67,
    roas: 3.61,
    impressions: 15000,
    clicks: 450,
    ctr: 3.0
  },
  {
    id: 'cmp_2',
    name: 'Kitchen Gadgets - Exact',
    status: CampaignStatus.ACTIVE,
    budget: 100.00,
    spend: 2100.20,
    sales: 8400.80,
    acos: 25.00,
    roas: 4.00,
    impressions: 22000,
    clicks: 880,
    ctr: 4.0
  },
  {
    id: 'cmp_3',
    name: 'Competitor Targeting - Brand X',
    status: CampaignStatus.PAUSED,
    budget: 30.00,
    spend: 450.00,
    sales: 900.00,
    acos: 50.00,
    roas: 2.00,
    impressions: 5000,
    clicks: 100,
    ctr: 2.0
  },
  {
    id: 'cmp_4',
    name: 'Auto - Discovery',
    status: CampaignStatus.OUT_OF_BUDGET,
    budget: 20.00,
    spend: 20.00,
    sales: 60.00,
    acos: 33.33,
    roas: 3.00,
    impressions: 1200,
    clicks: 40,
    ctr: 3.33
  }
];

export const MOCK_CHART_DATA: ChartDataPoint[] = [
  { date: 'Mon', spend: 120, sales: 400, acos: 30 },
  { date: 'Tue', spend: 132, sales: 500, acos: 26.4 },
  { date: 'Wed', spend: 101, sales: 350, acos: 28.8 },
  { date: 'Thu', spend: 134, sales: 480, acos: 27.9 },
  { date: 'Fri', spend: 190, sales: 700, acos: 27.1 },
  { date: 'Sat', spend: 230, sales: 900, acos: 25.5 },
  { date: 'Sun', spend: 210, sales: 850, acos: 24.7 },
];
