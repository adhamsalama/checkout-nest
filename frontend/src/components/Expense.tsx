import { Expense as ExpenseType } from "../types";

import Card from "react-bootstrap/Card";

export function Expense(props: ExpenseType) {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {new Date(props.date).toDateString()}
        </Card.Subtitle>
        <Card.Text>
          Price: {props.price}
          <br />
          Quantity: {props.quantity}
          <br />
          Seller: {props.sellerName}
        </Card.Text>
        <Card.Text>
          {props.tags.length > 0 ? `Tags: ${props.tags}` : "No Tags"}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Expense;
