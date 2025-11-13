/**
 * TipContext
 * Manages state for field tips including static tips and AI-generated tips
 */

import { createContext, useContext, useState, ReactNode } from 'react';

interface StaticTip {
  title: string;
  tip: string;
  example?: string;
  keyPoints?: string[];
  link?: string;
}

interface TipContextType {
  openModal: string | null;
  staticTips: Record<string, StaticTip>;
  openTipModal: (fieldName: string) => void;
  closeTipModal: () => void;
  requestAITip: (fieldName: string, formData: any) => Promise<string>;
  isAIAvailable: boolean;
}

const TipContext = createContext<TipContextType | undefined>(undefined);

// Static tips for all fields
const STATIC_TIPS: Record<string, StaticTip> = {
  dli: {
    title: 'DLI Number - Designated Learning Institution',
    tip: 'A DLI number is a unique identifier assigned by the Canadian government to approved schools. It always starts with the letter "O" followed by 9 digits.',
    example: 'O19391131604',
    keyPoints: [
      'Format: O + 9 digits (total 10 characters)',
      'Every approved Canadian school has one',
      'You can find it on your letter of acceptance',
      'Search for your school on the official DLI list'
    ],
    link: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/designated-learning-institutions-list.html'
  },
  canadianInstitution: {
    title: 'Canadian Educational Institution',
    tip: 'Enter the full official name of the Canadian school that accepted you. This should match exactly what appears on your letter of acceptance.',
    example: 'University of Toronto',
    keyPoints: [
      'Use the official name, not abbreviations',
      'Must be a Designated Learning Institution (DLI)',
      'Check your letter of acceptance for exact spelling'
    ]
  },
  programName: {
    title: 'Program Name',
    tip: 'The specific degree or certificate program you will be studying. Use the exact name from your letter of acceptance.',
    example: 'Master of Science in Computer Science',
    keyPoints: [
      'Include degree type (Bachelor\'s, Master\'s, etc.)',
      'Copy exactly from your acceptance letter',
      'Don\'t use abbreviations unless they appear in the letter'
    ]
  },
  programLevel: {
    title: 'Program Level',
    tip: 'The academic level of your program of study in Canada.',
    keyPoints: [
      'Certificate: Usually 1 year or less',
      'Diploma: Usually 2-3 years',
      'Bachelor\'s: Typically 4 years',
      'Master\'s: Usually 1-2 years',
      'PhD: Typically 3-5 years'
    ]
  },
  programStartDate: {
    title: 'Program Start Date',
    tip: 'The date when your classes begin, as stated in your letter of acceptance. Apply at least 3 months before this date.',
    keyPoints: [
      'Use the start date from your acceptance letter',
      'Apply early - processing takes 4-12 weeks',
      'Must be at least 3 months in the future',
      'Common start dates: September, January, May'
    ]
  },
  programDuration: {
    title: 'Program Duration',
    tip: 'The total length of your study program in months. Check your letter of acceptance for the exact duration.',
    example: '24 (for a 2-year Master\'s program)',
    keyPoints: [
      'Enter total months, not years',
      '12 months = 1 year, 24 months = 2 years',
      'Use the duration from your acceptance letter',
      'Include any mandatory internships/co-ops'
    ]
  },
  annualTuitionFees: {
    title: 'Annual Tuition Fees',
    tip: 'The cost of tuition for one academic year (usually 8-12 months) in Canadian Dollars. This should be stated in your acceptance letter.',
    example: '35000',
    keyPoints: [
      'Amount in CAD only (no currency symbols)',
      'Tuition for ONE year, not total program cost',
      'Check your acceptance letter for exact amount',
      'Do not include living expenses'
    ]
  },
  availableFunds: {
    title: 'Available Funds',
    tip: 'The total amount of money you have available to cover tuition and living expenses. IRCC requires proof that you can afford your education and living costs in Canada.',
    keyPoints: [
      'Must cover: tuition + CAD $10,000 for living expenses',
      'Additional CAD $4,000 per family member (if applicable)',
      'Amount in CAD',
      'You will need to prove this amount with bank statements'
    ]
  },
  fundingSource: {
    title: 'Funding Source',
    tip: 'How you will pay for your education in Canada. This helps IRCC understand your financial situation.',
    keyPoints: [
      'Personal Savings: Your own bank account',
      'Family Support: Parents/relatives funding you',
      'Scholarship: Award from school or organization',
      'Loan: Education loan from bank',
      'Sponsor: Organization or government sponsoring you'
    ]
  }
};

interface TipProviderProps {
  children: ReactNode;
  formData?: any;
}

export function TipProvider({ children, formData }: TipProviderProps) {
  const [openModal, setOpenModal] = useState<string | null>(null);

  const openTipModal = (fieldName: string) => {
    setOpenModal(fieldName);
  };

  const closeTipModal = () => {
    setOpenModal(null);
  };

  const requestAITip = async (fieldName: string, contextData: any): Promise<string> => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${API_URL}/api/tips/get-tips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fieldName,
          useAI: true,
          formData: contextData || formData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.aiTip) {
        return data.aiTip;
      } else if (data.success && data.tip) {
        // If tip is an object (static tip fallback), extract the tip text
        if (typeof data.tip === 'object' && data.tip.tip) {
          return data.tip.tip;
        }
        // If tip is already a string, return it
        return data.tip;
      } else {
        throw new Error('No tip returned from API');
      }
    } catch (error) {
      console.error('Error fetching AI tip:', error);
      throw error;
    }
  };

  // Check if AI is available (API key configured)
  const isAIAvailable = true; // Can add actual check later

  const value: TipContextType = {
    openModal,
    staticTips: STATIC_TIPS,
    openTipModal,
    closeTipModal,
    requestAITip,
    isAIAvailable
  };

  return <TipContext.Provider value={value}>{children}</TipContext.Provider>;
}

export function useTips() {
  const context = useContext(TipContext);
  if (context === undefined) {
    throw new Error('useTips must be used within a TipProvider');
  }
  return context;
}
