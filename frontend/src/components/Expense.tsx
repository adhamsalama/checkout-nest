import { useState } from "react";
import { Expense as ExpenseType } from "../types";

import Card from "react-bootstrap/Card";
import { Button, Modal, Form } from "react-bootstrap";
import { deleteExpense, updateExpense } from "../utils";

interface ExpenseProps extends ExpenseType {
  deleteExpense: (id: string) => void;
}

export function Expense(props: ExpenseProps) {
  const [name, setName] = useState(props.name);
  const [date, setDate] = useState(props.date);
  const [price, setPrice] = useState(props.price);
  const [quantity, setQuantity] = useState(props.quantity);
  const [sellerName, setSellerName] = useState(props.sellerName);
  const [tags, setTags] = useState(props.tags);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateExpense({
      _id: props._id,
      name,
      date,
      price,
      quantity,
      sellerName,
      tags,
    });
    setShowEditModal(false);
  };

  return (
    <>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {new Date(date).toDateString()}
          </Card.Subtitle>
          <Card.Text>
            Price: {price}
            <br />
            Quantity: {quantity}
            <br />
            Seller: {sellerName}
          </Card.Text>
          <Card.Text>{tags.length > 0 ? `Tags: ${tags}` : "No Tags"}</Card.Text>
        </Card.Body>
        <Button variant="primary" onClick={() => setShowEditModal(true)}>
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={() =>
            deleteExpense(props._id).then((data) => {
              props.deleteExpense(props._id);
            })
          }
        >
          Delete
        </Button>
      </Card>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={
                  // date to mm/dd/yy
                  new Date(date).toLocaleDateString("en-CA")
                }
                onChange={(event) => setDate(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(event) => setPrice(parseFloat(event.target.value))}
              />
            </Form.Group>
            <Form.Group controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(parseInt(event.target.value))}
              />
            </Form.Group>
            <Form.Group controlId="formSellerName">
              <Form.Label>Seller Name</Form.Label>
              <Form.Control
                type="text"
                value={sellerName}
                onChange={(event) => setSellerName(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formTags">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                value={tags}
                onChange={(event) => {
                  const tags = event.target.value.split(",");
                  setTags(tags);
                }}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Expense;
