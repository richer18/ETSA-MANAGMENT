import { Box, Step, StepButton, Stepper } from "@mui/material";
import React from "react";
import { AddressProvider } from "./AddressContext"; // <-- import your context provider
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

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  // const handleStep = (step) => () => setActiveStep(step);

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <BusinessForm handleNext={handleNext} />;
      case 1:
        return (
          <BusinessAddress handleNext={handleNext} handleBack={handleBack} />
        );
      case 2:
        return (
          <BusinessOperation handleNext={handleNext} handleBack={handleBack} />
        );
      case 3:
        return (
          <BusinessAdditional handleNext={handleNext} handleBack={handleBack} />
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
          {steps.map((label, index) => (
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

// Wrap BNew in AddressProvider
export default function BNewWrapper() {
  return (
    <AddressProvider>
      <BNew />
    </AddressProvider>
  );
}
