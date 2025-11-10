/**
 * StepNavigation Component
 * Previous/Next navigation buttons for form steps
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  canProgress: boolean;
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  canProgress
}: StepNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <button
        onClick={onPrevious}
        disabled={isFirstStep}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
          isFirstStep
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-ircc-blue hover:bg-gray-300'
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
        Previous
      </button>

      <div className="text-sm text-ircc-gray">
        Step {currentStep} of {totalSteps}
      </div>

      <button
        onClick={onNext}
        disabled={isLastStep || !canProgress}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
          isLastStep || !canProgress
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-ircc-blue text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
        }`}
      >
        Next
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
