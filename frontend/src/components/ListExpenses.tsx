import { useEffect, useState } from "react";
import { Expense as ExpenseType } from "../types";
import { getExpenses, getUser } from "../utils";
import { Expense } from "./Expense";
import { Col, Row } from "react-bootstrap";

export function ListExpenses() {
  const user = getUser();
  if (!user) return <h1>Login</h1>;
  const [expenses, setExpenses] = useState<ExpenseType[]>();
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  useEffect(() => {
    const data = getExpenses(0, 20);
    data.then((data) => setExpenses(data));
  }, []);
  if (!expenses) return <h1>No expenses</h1>;
  return (
    <>
      <Row xs={1} md={2} lg={4} className="g-4">
        {expenses.map((expense) => {
          return (
            <Col key={expense._id}>
              <Expense key={expense._id} {...expense} />
            </Col>
          );
        })}
      </Row>
    </>
  );
}
