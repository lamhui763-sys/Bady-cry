export type Subject = 'Baby' | 'Dog' | 'Cat';

// CryType is now a generic string, as the specific types differ per subject.
export type CryType = string;

export interface CryRecord {
  id: string;
  timestamp: string;
  subject: Subject;
  cryType: CryType;
  suggestion: string;
  confidence: number;
  behavior?: string;
}

export interface TranslationResult {
  cryType: CryType;
  confidence: number;
  suggestion: string;
  behavior?: string;
}
