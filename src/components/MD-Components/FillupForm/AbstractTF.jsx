

import "bootstrap/dist/css/bootstrap.min.css";
import React, { useCallback, useEffect, useState } from 'react';
import { FaTrash } from "react-icons/fa";

import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  ProgressBar,
  Row,
} from "react-bootstrap";





  const fieldOptions = ['BUILDING_PERMIT_FEE', 'ELECTRICAL_FEE', 'ZONING_FEE', 'LIVESTOCK_DEV_FUND', 'DIVING_FEE'];
  const cashier = ['Please a select','FLORA MY','IRIS','RICARDO','AGNES'];

const fieldConfigs = {
  BUILDING_PERMIT_FEE: {
    label: 'Building Permit Fee',
    percentages: [
      { label: 'Local Fund (80%)', value: (value) => (value * 0.8).toFixed(2) },
      { label: 'Trust Fund (15%)', value: (value) => (value * 0.15).toFixed(2) },
      { label: 'National Fund (5%)', value: (value) => (value * 0.05).toFixed(2) },
    ],
  },
  LIVESTOCK_DEV_FUND: {
    label: 'Livestock Dev. Fund',
    percentages: [
      { label: 'Local Fund (80%)', value: (value) => (value * 0.8).toFixed(2) },
      { label: 'National Fund (20%)', value: (value) => (value * 0.2).toFixed(2) },
    ],
  },
  DIVING_FEE: {
    label: 'Diving Fee',
    percentages: [
      { label: 'GF (40%)', value: (value) => (value * 0.4).toFixed(2) },
      { label: 'BRGY (30%)', value: (value) => (value * 0.3).toFixed(2) },
      { label: 'Fishers (30%)', value: (value) => (value * 0.3).toFixed(2) },
    ],
  },
  ELECTRICAL_FEE: {
    label: 'Electrical Fee',
    percentages: [],
  },
  ZONING_FEE: {
    label: 'Zoning Fee',
    percentages: [],
  },
};


  const filterOptions = (options, inputValue) => {
  if (!inputValue) {
    return options;
  }

  return options
    .filter(option => option && typeof option === 'string')
    .filter(option =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
};

const BASE_URL = "http://192.168.101.109:3001"; // Define base URL

function AbstractTF({ data, mode,refreshData  }) {
  const [fields, setFields] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [showSelect, setShowSelect] = useState(true);
  const [selectedField, setSelectedField] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCashier, setSelectedCashier] = useState('');
  const [taxpayerName, setTaxpayerName] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [typeReceipt, setTypeReceipt] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [alertVariant, setAlertVariant] = useState("info");



   const handleFieldChange = (field, value) => {
    setFieldValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
      
// Total Calculation Hook
 // Calculate Total
 useEffect(() => {
   const totalSum = Object.values(fieldValues).reduce(
     (acc, value) => acc + parseFloat(value || 0),
     0
   );
   setTotal(totalSum);
 }, [fieldValues]);

  const handleFieldSelect = (event) => {
    const selectedField = event.target.value;
    if (selectedField) {
      setFields([...fields, selectedField]);
      setFieldValues({ ...fieldValues, [selectedField]: '' });
      setSelectedField('');
      setShowSelect(false);
    }
  };

  const handleClearFields = React.useCallback(() => {
    setSelectedDate(null);
    setTaxpayerName('');
    setReceiptNumber('');
    setTypeReceipt('');
    setSelectedCashier('');
    setFieldValues({});
    setFields([]);
  }, []);
  
  const handleSave = useCallback(async () => {
    if (!selectedDate || !taxpayerName || !receiptNumber || !typeReceipt || !selectedCashier) {
      setAlertMessage('Please fill out all required fields.');
      setAlertVariant("error");
      return;
    }

    const payload = {
      DATE: selectedDate,
      NAME: taxpayerName,
      RECEIPT_NO: receiptNumber,
      CASHIER: selectedCashier,
      TYPE_OF_RECEIPT: typeReceipt,
      TOTAL: total,
      ...fieldValues,
    };

    setLoading(true);

    try {
      const url = mode === 'edit'
        ? `${BASE_URL}/api/update-trust-fund/${data.ID}`
        : `${BASE_URL}/api/save-trust-fund`;

      const response = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMessage = response.status === 400 ? 'Receipt number already exists.' : 'Failed to save data.';
        throw new Error(errorMessage);
      }

      setAlertMessage(mode === 'edit' ? 'Data updated successfully.' : 'Data saved successfully.');
      setAlertVariant("success");

      handleClearFields();

      // Refresh the page after a short delay to allow alert messages to be shown
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Adjust delay if needed
    } catch (error) {
      setAlertMessage(error.message);
      setAlertVariant("error");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, taxpayerName, receiptNumber, typeReceipt, selectedCashier, total, fieldValues, mode, data, handleClearFields]);


// Handle form submission and progress animation
React.useEffect(() => {
  if (loading) {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer); // Stop the timer when 100% is reached
          handleSave(); // Trigger save operation when 100% is reached
          return 100; // Ensure progress stays at 100%
        }
        const diff = Math.random() * 10;
        return Math.min(prevProgress + diff, 100);
      });
    }, 300); // Adjust the interval time if needed

    return () => {
      clearInterval(timer);
    };
  }
}, [loading, handleSave]); // Include handleSave in the dependency array

  // Handle Remove Field
  const handleRemoveField = (fieldToRemove) => {
    const updatedFields = fields.filter((field) => field !== fieldToRemove);
    setFields(updatedFields);

    setFieldValues((prevValues) => {
      const updatedValues = { ...prevValues };
      delete updatedValues[fieldToRemove];
      return updatedValues;
    });
  };


   // -----------------------------
    //  PREFILL IF EDIT MODE
    // -----------------------------
    useEffect(() => {
      if (mode === 'edit' && data) {
        // The field names below must match the DB fields from your table
        setSelectedDate(data.DATE || null);
        setTaxpayerName(data.NAME || '');
        setReceiptNumber(data.RECEIPT_NO || '');
        setTypeReceipt(data.TYPE_OF_RECEIPT || '');
        setSelectedCashier(data.CASHIER || '');
  
        // For dynamic fields, if your DB includes them, you can parse them here:
        // e.g., if your row has 'Manufacturing', 'Retailing', etc. as numeric values
        // We build an array & object from what's actually present on `data`
        const newFields = [];
        const newFieldValues = {};
  
        // Check each known fieldOption, if it’s > 0 or some value, treat it as present
        fieldOptions.forEach((fieldKey) => {
          if (data[fieldKey] !== undefined && data[fieldKey] !== 0) {
            newFields.push(fieldKey);
            newFieldValues[fieldKey] = data[fieldKey].toString(); // or data[fieldKey]
          }
        });
  
        setFields(newFields);
        setFieldValues(newFieldValues);
      }
    }, [data, mode]);
    
    
    const filteredOptions = filterOptions(fieldOptions);
  return (
    <Container>
      <h4 className="mb-4 text-center">
        Trust Fund Abstracts ({mode === "edit" ? "Edit" : "Add"})
      </h4>
      <Form onSubmit={handleSave}>
        <Row className="g-3 mb-4">
          <Col md={12}>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="formTaxpayer">
              <Form.Label>NAME OF TAXPAYER</Form.Label>
              <Form.Control
                type="text"
                value={taxpayerName}
                onChange={(e) => setTaxpayerName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="formReceipt">
              <Form.Label>RECEIPT NO. P.F. NO. 25(A)</Form.Label>
              <Form.Control
                type="text"
                value={receiptNumber}
                onChange={(e) => setReceiptNumber(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="formReceiptType">
              <Form.Label>Type of Receipt</Form.Label>
              <Form.Control
                type="text"
                value={typeReceipt}
                onChange={(e) => setTypeReceipt(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="formCashier">
              <Form.Label>Select Cashier</Form.Label>
              <Form.Select
                value={selectedCashier}
                onChange={(e) => setSelectedCashier(e.target.value)}
                required
              >
                {cashier.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Enhanced Dynamic Fields With Breakdown */}
          {fields.map((field) => {
            const config = fieldConfigs[field];
            if (!config) return null;

            const rawValue = fieldValues[field];
            const numericValue = parseFloat(rawValue);

            // Only show fields with value > 0
            if (!numericValue || numericValue <= 0) return null;

            return (
              <Col md={12} key={field}>
                <Form.Group controlId={`form-${field}`}>
                  <Form.Label>{config.label}</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      value={rawValue}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      required
                    />
                    <Button
                      variant="outline-danger"
                      onClick={() => handleRemoveField(field)}
                    >
                      <FaTrash />
                    </Button>
                  </InputGroup>

                  {config.percentages.length > 0 && (
                    <div className="mt-2 ms-2">
                      {config.percentages.map((p, idx) => (
                        <div
                          key={idx}
                          style={{ fontSize: "0.875rem", color: "#6c757d" }}
                        >
                          <strong>{p.label}:</strong> ₱{p.value(numericValue)}
                        </div>
                      ))}
                    </div>
                  )}
                </Form.Group>
              </Col>
            );
          })}

          <Col md={12}>
            <Button
              variant="primary"
              onClick={() => setShowSelect(true)}
              className="mt-2"
            >
              Add New Field
            </Button>
          </Col>

          <Col md={12}>
            <h5 className="mt-3">Total: ₱{total.toFixed(2)}</h5>
          </Col>
        </Row>

        {alertMessage && (
          <Alert variant={alertVariant} className="mt-3">
            {alertMessage}
          </Alert>
        )}

        {loading && (
          <ProgressBar
            now={progress}
            label={`${progress.toFixed(0)}%`}
            animated
            className="mt-3"
          />
        )}

        <div className="d-flex justify-content-end mt-4">
          <Button
            variant="secondary"
            onClick={handleClearFields}
            className="me-2"
          >
            Reset
          </Button>
          <Button variant="primary" type="submit">
            {mode === "edit" ? "Update" : "Save"}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default AbstractTF
