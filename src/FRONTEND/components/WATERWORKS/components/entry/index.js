import dayjs from "dayjs";
import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

const cashier = [
  "Please select",
  "FLORA MY",
  "IRIS",
  "RICARDO",
  "AGNES",
  "AMABELLA",
];

function Index() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCashier, setSelectedCashier] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [monthList, setMonthList] = useState([]);
  const [paymentMode, setPaymentMode] = useState("monthly");
  const [totalPay, setTotalPay] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const overall = parseFloat(totalPay || 0) + parseFloat(totalInterest || 0);
  const generateMonths = () => {
    if (!startMonth || !endMonth) return;

    const start = dayjs(startMonth);
    const end = dayjs(endMonth);

    const months = [];
    let current = start;

    while (current.isBefore(end) || current.isSame(end, "month")) {
      months.push(current.format("YYYY-MM"));
      current = current.add(1, "month");
    }

    setMonthList(months);
  };

  return (
    <Container>
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
          <Form.Group controlId="formAccountNumber">
            <Form.Label>Account Number</Form.Label>
            <Form.Control type="text" required />
          </Form.Group>
        </Col>

        <Col md={12}>
          <Form.Group controlId="formTaxpayerName">
            <Form.Label>NAME OF TAXPAYER</Form.Label>
            <Form.Control type="text" required />
          </Form.Group>
        </Col>

        <Col md={12}>
          <Form.Group controlId="formReceipt">
            <Form.Label>RECEIPT NO. P.F. NO. 25(A)</Form.Label>
            <Form.Control type="text" required />
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

        {/* Show after selecting cashier */}
        {selectedCashier && (
          <>
            <Col md={6}>
              <Form.Group controlId="formStartMonth">
                <Form.Label>Start Month</Form.Label>
                <Form.Control
                  type="month"
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formEndMonth">
                <Form.Label>End Month</Form.Label>
                <Form.Control
                  type="month"
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  onBlur={generateMonths}
                />
              </Form.Group>
            </Col>

            {/* Payment Mode Toggle */}
            <Col md={12}>
              <Form.Group controlId="formPaymentMode">
                <Form.Label>Payment Mode</Form.Label>
                <Form.Select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <option value="monthly">Pay Monthly</option>
                  <option value="full">Pay Full (One-Time)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </>
        )}

        {/* Show per-month inputs if mode is "monthly" */}
        {paymentMode === "monthly" &&
          monthList.length > 0 &&
          monthList.map((month, index) => (
            <React.Fragment key={month}>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{dayjs(month).format("MMMM YYYY")}</Form.Label>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId={`payment-${index}`}>
                  <Form.Label>Payment</Form.Label>
                  <Form.Control type="number" min="0" step="0.01" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId={`interest-${index}`}>
                  <Form.Label>Interest</Form.Label>
                  <Form.Control type="number" min="0" step="0.01" />
                </Form.Group>
              </Col>
            </React.Fragment>
          ))}

        {/* Show total inputs if mode is "full" */}
        {paymentMode === "full" && monthList.length > 0 && (
          <>
            <Col md={6}>
              <Form.Group controlId="totalPayment">
                <Form.Label>Total Payment Amount</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={totalPay}
                  onChange={(e) => setTotalPay(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="totalInterest">
                <Form.Label>Total Interest</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={totalInterest}
                  onChange={(e) => setTotalInterest(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <div className="mt-3 p-3 border rounded bg-light">
                <strong>TOTAL PAY:</strong> ₱
                {parseFloat(totalPay || 0).toFixed(2)} <br />
                <strong>INTEREST:</strong> ₱
                {parseFloat(totalInterest || 0).toFixed(2)} <br />
                <strong>OVERALL:</strong>{" "}
                <span className="text-primary fw-bold">
                  ₱{overall.toFixed(2)}
                </span>
              </div>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
}

export default Index;
