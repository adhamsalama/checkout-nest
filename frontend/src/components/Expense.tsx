import { useState } from "react";
import { Expense as ExpenseType } from "../types";

import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
import { deleteExpense } from "../utils";

export function Expense(
  props: ExpenseType & { deleteExpense: (id: string) => void }
) {
  const [name, setName] = useState(props.name);
  const [date, setDate] = useState(props.date);
  const [price, setPrice] = useState(props.price);
  const [quantity, setQuantity] = useState(props.quantity);
  const [sellerName, setSellerName] = useState(props.sellerName);
  const [tags, setTags] = useState(props.tags);
  return (
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
      {/* bootstrap edit button */}
      <Button variant="primary" onClick={() => {}}>
        Edit
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          deleteExpense(props._id).then((data) => {
            console.log({ data });
            // do fade out animation for component
            props.deleteExpense(props._id);
          })
        }
      >
        Delete
      </Button>
    </Card>
  );
}

export default Expense;
