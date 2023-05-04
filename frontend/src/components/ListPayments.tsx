import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Modal,
} from "react-bootstrap";
import { config } from "../../config";

interface Payment {
  _id: number;
  name: string;
  value: number;
  date: string;
  description: string;
}

const PaymentPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editPaymentId, setEditPaymentId] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/payments", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setPayments(data))
      .catch((error) => console.error(error));
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt(e.target.value));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleEditPayment = (paymentId: number) => {
    const payment = payments.find((p) => p._id === paymentId);
    if (payment) {
      setEditPaymentId(payment._id);
      setName(payment.name);
      setValue(payment.value);
      setDate(payment.date);
      setDescription(payment.description);
      setShowEditModal(true);
    }
  };

  const handleDeletePayment = (payment: Payment) => {
    if (window.confirm(`Are you sure you want to delete ${payment.name}?`)) {
      fetch(`http://localhost:4000/payments/${payment._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(() => setPayments(payments.filter((p) => p._id !== payment._id)))
        .catch((error) => console.error(error));
    }
  };

  const handleCloseEditModal = () => {
    // setName("");
    // setValue(0);
    // setDate("");
    // setDescription("");
    // setEditPaymentId(null);
    setShowEditModal(false);
  };

  const handleSaveEditModal = () => {
    if (editPaymentId !== null) {
      fetch(`http://localhost:4000/payments/${editPaymentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          value,
          date,
          description,
        }),
      })
        .then(() => {
          const updatedPayments = payments.map((payment) =>
            payment._id === editPaymentId
              ? { ...payment, name, value, date, description }
              : payment
          );
          setPayments(updatedPayments);
          handleCloseEditModal();
        })
        .catch((error) => console.error(error));
    }
  };

  const handleAddPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`${config.baseUrl}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name,
        value,
        date,
        description,
      }),
    })
      .then((response) => response.json())
      .then((data: Payment) => {
        setPayments([...payments, data]);
        setName("");
        setValue(0);
        setDate("");
        setDescription("");
      })
      .catch((error) => console.error(error));
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Add Payment</h1>
          <Form onSubmit={handleAddPayment}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter payment name"
                value={name}
                onChange={handleNameChange}
              />
            </Form.Group>
            <Form.Group controlId="value">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter payment value"
                value={value}
                onChange={handleValueChange}
              />
            </Form.Group>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter payment date"
                value={date}
                onChange={handleDateChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Col>
      </Row>
      <Row>
        {payments.map((payment) => (
          <Col key={payment._id} md={4} style={{ marginBottom: "20px" }}>
            <Card>
              <Card.Body>
                <Card.Title>{payment.name}</Card.Title>
                <Card.Text>
                  Value: {payment.value}
                  <br />
                  Date: {payment.date}
                  <br />
                  Description: {payment.description}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => handleEditPayment(payment._id)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeletePayment(payment)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter payment name"
                value={name}
                onChange={handleNameChange}
              />
            </Form.Group>
            <Form.Group controlId="value">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter payment value"
                value={value}
                onChange={handleValueChange}
              />
            </Form.Group>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter payment date"
                value={date}
                onChange={handleDateChange}
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter payment description"
                value={description}
                onChange={handleDescriptionChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEditModal}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PaymentPage;
