/**
 * ProgressBar Component
 * Visual progress indicator for multi-step form
 */

import { Check } from 'lucide-react';
import { FORM_STEPS } from '../types/form.types';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-ircc-blue to-blue-600 transition-all duration-300 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Step Indicators (Desktop) */}
      <div className="hidden md:flex justify-between mt-6">
        {FORM_STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <div key={step.id} className="flex flex-col items-center" style={{ width: `${100 / totalSteps}%` }}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-ircc-blue text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
              </div>
              <p
                className={`mt-2 text-xs text-center font-medium ${
                  isCurrent ? 'text-ircc-blue' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {step.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile Progress Text */}
      <div className="md:hidden text-center mt-3">
        <p className="text-sm font-medium text-ircc-blue">
          Step {currentStep} of {totalSteps}
        </p>
        <p className="text-xs text-ircc-gray mt-1">
          {FORM_STEPS[currentStep - 1].title}
        </p>
      </div>
    </div>
  );
}
