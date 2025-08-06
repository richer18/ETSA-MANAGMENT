import { Box, Step, StepButton, Stepper } from "@mui/material";
import React from "react";
import BusinessAdditional from "./BusinessAdditional";
import BusinessAddress from "./BusinessAdress";
import BusinessForm from "./BusinessFormNew";
import BusinessOperation from "./BusinessOperation";

const steps = [
  "Business Information and Registration",
  "Business Address",
  "Business Operation",
  "Additional Details",
  "Review & Submit",
];

function BNew() {
  const [activeStep, setActiveStep] = React.useState(0);

  // Manage ALL form data in parent state
  const [formData, setFormData] = React.useState({
    businessInfo: {},
    businessAddress: {},
    businessOperation: {},
    businessAdditional: {},
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Update handler for any form section
  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <BusinessForm
            data={formData.businessInfo}
            updateData={(data) => updateFormData("businessInfo", data)}
            handleNext={handleNext}
          />
        );
      case 1:
        return (
          <BusinessAddress
            data={formData.businessAddress}
            updateData={(data) => updateFormData("businessAddress", data)}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 2:
        return (
          <BusinessOperation
            data={formData.businessOperation}
            updateData={(data) => updateFormData("businessOperation", data)}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 3:
        return (
          <BusinessAdditional
            data={formData.businessAdditional}
            updateData={(data) => updateFormData("businessAdditional", data)}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 4:
        return <div>Review & Submit Component</div>;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Stepper nonLinear activeStep={activeStep} sx={{ width: "80%" }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepButton color="inherit">{label}</StepButton>
            </Step>
          ))}
        </Stepper>
      </Box>
      {renderStepContent()}
    </Box>
  );
}

export default BNew;
