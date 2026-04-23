export interface BusinessOverview {
  businessName: string;
  businessType: string;
  industry: string;
  businessDescription: string;
  coreOffering: string;
  positioning: string;
  marketCategory: string;
  brandTone: string;
}

export interface TargetMarket {
  audienceType: string;
  targetSegment: string;
  companySize: string;
  geography: string;
  buyerType: string;
  customerMaturityLevel: string;
}

export interface PersonaBase {
  personaName: string;
  jobRole: string;
  seniority: string;
  ageRange: string;
  gender: string;
  location: string;
  incomeLevel: string;
}

export interface PainPointsAndGoals {
  keyPainPoints: string[];
  goals: string[];
  motivations: string[];
  desiredOutcomes: string[];
  dailyChallenges: string[];
}

export interface BuyingSignals {
  buyingTriggers: string[];
  objections: string[];
  decisionFactors: string[];
  preferredChannels: string[];
  contentPreferences: string[];
}

export interface ICPFormData {
  businessOverview: BusinessOverview;
  targetMarket: TargetMarket;
  personaBase: PersonaBase;
  painPointsAndGoals: PainPointsAndGoals;
  buyingSignals: BuyingSignals;
}

export interface Webhook1Response {
  success: boolean;
  data: ICPFormData & {
    meta: {
      sourceUrl: string;
      analysisSummary: string;
      confidence: Record<string, number>;
    };
  };
}

export interface PersonaSnapshot {
  personaName: string;
  jobRole: string;
  industry: string;
  companySize: string;
  geography: string;
  seniority: string;
  summary: string;
}

export interface WhoThisCustomerIs {
  overview: string;
  responsibilities: string[];
  mindset: string[];
  maturityLevel: string;
}

export interface GoalsAndMotivations {
  goals: string[];
  motivations: string[];
}

export interface MessagingStrategy {
  valueProps: string[];
  positioningAngles: string[];
  hooks: string[];
  sampleOutreachAngles: string[];
}

export interface ChannelStrategy {
  primaryChannels: string[];
  secondaryChannels: string[];
  contentTypes: string[];
}

export interface Webhook2Response {
  success: boolean;
  data: {
    personaSnapshot: PersonaSnapshot;
    whoThisCustomerIs: WhoThisCustomerIs;
    painPoints: string[];
    goalsAndMotivations: GoalsAndMotivations;
    buyingTriggers: string[];
    objections: string[];
    decisionFactors: string[];
    messagingStrategy: MessagingStrategy;
    channelStrategy: ChannelStrategy;
    nextActions: string[];
  };
}

export type ToolState = 
  | 'INITIAL' 
  | 'ANALYZING' 
  | 'REVIEW' 
  | 'GENERATING' 
  | 'RESULTS' 
  | 'ERROR';
