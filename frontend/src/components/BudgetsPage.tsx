
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Modal, Form } from "react-bootstrap";
import { config } from "../../config";

interface Budget {
  name: string;
  value: number;
}

const BudgetCard: React.FC<{ budget: Budget; onEdit: () => void; onDelete: () => void }> = ({ budget, onEdit, onDelete }) => (
  <Col md={4} className="mb-3">
    <Card>
      <Card.Body>
        <Card.Title>{budget.name}</Card.Title>
        <Card.Text>Value: ${budget.value}</Card.Text>
        <Button variant="warning" onClick={onEdit} className="me-2">
          Edit
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  </Col>
);

const BudgetPage: React.FC = () => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    fetch(`${config.baseUrl}/budgets/monthly`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBudget(data);
        setName(data.name);
        setValue(data.value);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSaveBudget = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const method = budget ? "PUT" : "POST";
    const url = `${config.baseUrl}/budgets/monthly`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, value }),
    })
      .then((response) => response.json())
      .then((data: Budget) => {
        setBudget(data);
        setShowModal(false);
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteBudget = () => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      fetch(`${config.baseUrl}/budgets/monthly`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(() => {
          setBudget(null);
          setName("");
          setValue(0);
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
          >
            {budget ? "Edit Monthly Budget" : "Add Monthly Budget"}
          </Button>
        </Col>
      </Row>
      <Row>
        {budget && <BudgetCard budget={budget} onEdit={() => setShowModal(true)} onDelete={handleDeleteBudget} />}
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{budget ? "Edit Budget" : "Add Budget"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveBudget}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter budget name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="value" className="mt-3">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter budget value"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save Budget
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default BudgetPage;

