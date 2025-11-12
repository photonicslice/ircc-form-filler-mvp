/**
 * FormWizard Component
 * Manages multi-step form navigation and state
 */

import { useState, useEffect } from 'react';
import { FormData, FORM_STEPS } from '../types/form.types';
import ProgressBar from './ProgressBar';
import StepNavigation from './StepNavigation';
import PersonalInfo from './steps/PersonalInfo';
import PassportInfo from './steps/PassportInfo';
import MaritalLanguage from './steps/MaritalLanguage';
import ContactInfo from './steps/ContactInfo';
import EducationHistory from './steps/EducationHistory';
import StudyPurpose from './steps/StudyPurpose';
import ProofOfFunds from './steps/ProofOfFunds';
import ReviewSubmit from './steps/ReviewSubmit';
import { autoSaveFormData } from '../utils/storage';

interface FormWizardProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export default function FormWizard({ formData, setFormData }: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [sectionErrors, setSectionErrors] = useState<Record<string, Record<string, string>>>({});

  // Auto-save form data when it changes
  useEffect(() => {
    autoSaveFormData(formData, 2000); // Save after 2 seconds of inactivity
  }, [formData]);

  const handleNext = () => {
    if (currentStep < FORM_STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateFormData = (section: keyof FormData, data: any) => {
    setFormData({
      ...formData,
      [section]: data
    });
  };

  const updateSectionErrors = (section: string, errors: Record<string, string>) => {
    setSectionErrors(prev => ({
      ...prev,
      [section]: errors
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfo
            data={formData.personalInfo}
            updateData={(data) => updateFormData('personalInfo', data)}
            errors={sectionErrors['personalInfo'] || {}}
            updateErrors={(errors) => updateSectionErrors('personalInfo', errors)}
          />
        );
      case 2:
        return (
          <PassportInfo
            data={formData.passportInfo}
            updateData={(data) => updateFormData('passportInfo', data)}
            errors={sectionErrors['passportInfo'] || {}}
            updateErrors={(errors) => updateSectionErrors('passportInfo', errors)}
          />
        );
      case 3:
        return (
          <MaritalLanguage
            maritalData={formData.maritalInfo}
            languageData={formData.languageInfo}
            updateMaritalData={(data) => updateFormData('maritalInfo', data)}
            updateLanguageData={(data) => updateFormData('languageInfo', data)}
            errors={sectionErrors['maritalLanguage'] || {}}
            updateErrors={(errors) => updateSectionErrors('maritalLanguage', errors)}
          />
        );
      case 4:
        return (
          <ContactInfo
            data={formData.contactInfo}
            updateData={(data) => updateFormData('contactInfo', data)}
            errors={sectionErrors['contactInfo'] || {}}
            updateErrors={(errors) => updateSectionErrors('contactInfo', errors)}
          />
        );
      case 5:
        return (
          <EducationHistory
            data={formData.educationHistory}
            updateData={(data) => updateFormData('educationHistory', data)}
            errors={sectionErrors['educationHistory'] || {}}
            updateErrors={(errors) => updateSectionErrors('educationHistory', errors)}
          />
        );
      case 6:
        return (
          <StudyPurpose
            data={formData.studyPurpose}
            updateData={(data) => updateFormData('studyPurpose', data)}
            errors={sectionErrors['studyPurpose'] || {}}
            updateErrors={(errors) => updateSectionErrors('studyPurpose', errors)}
          />
        );
      case 7:
        return (
          <ProofOfFunds
            data={formData.proofOfFunds}
            updateData={(data) => updateFormData('proofOfFunds', data)}
            errors={sectionErrors['proofOfFunds'] || {}}
            updateErrors={(errors) => updateSectionErrors('proofOfFunds', errors)}
          />
        );
      case 8:
        return (
          <ReviewSubmit
            formData={formData}
            onEdit={(step) => setCurrentStep(step)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} totalSteps={FORM_STEPS.length} />

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-ircc-blue mb-2">
            {FORM_STEPS[currentStep - 1].title}
          </h2>
          <p className="text-ircc-gray">
            {FORM_STEPS[currentStep - 1].description}
          </p>
        </div>

        {renderStep()}

        {/* Navigation */}
        {currentStep < 8 && (
          <StepNavigation
            currentStep={currentStep}
            totalSteps={FORM_STEPS.length}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canProgress={true}
          />
        )}
      </div>

      {/* Step Indicator (Mobile) */}
      <div className="md:hidden mt-4 flex justify-center gap-2">
        {FORM_STEPS.map((step, index) => (
          <button
            key={step.id}
            onClick={() => handleStepClick(index + 1)}
            className={`w-3 h-3 rounded-full transition ${
              currentStep === index + 1
                ? 'bg-ircc-blue'
                : currentStep > index + 1
                ? 'bg-green-500'
                : 'bg-gray-300'
            }`}
            aria-label={`Go to ${step.title}`}
          />
        ))}
      </div>
    </div>
  );
}
