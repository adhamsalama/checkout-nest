import { useEffect, useState } from "react";
import { Expense as ExpenseType } from "../types";
import { getExpenses, getUser } from "../utils";
import { Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { config } from "../../config";
import Expense from "./Expense";

export function SearchPage() {
  const user = getUser();
  if (!user) return <h1>Login</h1>;
  const [expenses, setExpenses] = useState<ExpenseType[]>();
  // const date = new Date();
  // const year = date.getFullYear();
  // const month = date.getMonth() + 1;
  // const day = date.getDate();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [priceGte, setPriceGte] = useState(0);
  const [priceLte, setPriceLte] = useState(0);

  const [limit, setLimit] = useState("");
  const [offset, setOffset] = useState("");
  const [tags, setTags] = useState("");
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log({ token });
    let url = config.baseUrl + "/expenses?";
    if (name) url += `name=${encodeURI(name)}&`;
    if (priceGte) url += `priceGte=${priceGte}&`;
    if (priceLte) url += `priceLte=${priceLte}&`;
    if (date) url += `date=${date}&`;
    if (limit) url += `limit=${limit}&`;
    if (offset) url += `offset=${offset}&`;
    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      for (const tag of tagsArray) {
        url += `tags=${tag}&`;
      }
    }
    const data = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data);
      });
  };

  return (
    <>
      <Form onSubmit={submit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Price Greater than or equal</Form.Label>
          <Form.Control
            type="number"
            value={priceGte}
            onChange={(e) => setPriceGte(parseFloat(e.target.value))}
            placeholder="Price"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Price Less than or equal</Form.Label>
          <Form.Control
            type="number"
            value={priceLte}
            onChange={(e) => setPriceLte(parseFloat(e.target.value))}
            placeholder="Price"
          />
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Quantity</Form.Label>
        <Form.Control
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseFloat(e.target.value))}
          placeholder="Quantity"
        />
      </Form.Group> */}
        {/* <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Seller Name</Form.Label>
        <Form.Control
          type="text"
          value={sellerName}
          onChange={(e) => setSellerName(e.target.value)}
          placeholder="Seller"
        />
      </Form.Group> */}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Tags</Form.Label>
          <Form.Control
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Date"
          />
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Comment</Form.Label>
        <Form.Control
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="comment"
        />
      </Form.Group> */}
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>
      {expenses ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {expenses.map((expense) => {
            return (
              <Col key={expense._id}>
                <Expense key={expense._id} {...expense} />
              </Col>
            );
          })}
        </Row>
      ) : (
        <h1>No expenses</h1>
      )}
    </>
  );
}
