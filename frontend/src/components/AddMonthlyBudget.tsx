import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { config } from "../../config";
import { MonthlyBudget } from "../types";

function AddMonthlyBudget({ func }: { func: (budget: MonthlyBudget) => any }) {
  const [name, setName] = useState("");
  const [value, setValue] = useState(0);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log({ token });

    const data = await fetch(config.baseUrl + "/expenses", {
      method: "POST",
      body: JSON.stringify({
        name,
        value,
      }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        func(data);
        setName("");
        setValue(0);
      });
  };
  return (
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
        <Form.Label>Value</Form.Label>
        <Form.Control
          type="number"
          value={value}
          onChange={(e) => {
            const p = parseFloat(e.target.value);
            if (isNaN(p)) return e.target.value;
            setValue(p);
          }}
          placeholder="Price"
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}


export default AddMonthlyBudget;

