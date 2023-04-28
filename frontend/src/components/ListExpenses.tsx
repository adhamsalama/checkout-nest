import { useEffect, useState } from "react";
import { Expense as ExpenseType } from "../types";
import { getExpenses, getUser } from "../utils";
import { Expense } from "./Expense";
import { Col, Row } from "react-bootstrap";
import AddProduct from "./AddExpense";

export function ListExpenses() {
  function deleteExpense(id: string) {
    setExpenses(expenses?.filter((expense) => expense._id !== id));
  }
  const user = getUser();
  if (!user) return <h1>Login</h1>;
  const [expenses, setExpenses] = useState<ExpenseType[]>();
  const [offset, setOffset] = useState(0);
  const OFFSET_STEP = 20;
  const handleScroll = async () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (bottom) {
      setOffset(offset + OFFSET_STEP + 1);
    }
  };
  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });
  useEffect(() => {
    const data = getExpenses(offset, 20);

    data.then((data) => {
      setExpenses([...(expenses ?? []), ...data]);
    });
  }, [offset]);
  return (
    <>
      <AddProduct
        func={(expense: ExpenseType) => {
          setExpenses(expenses ? [expense, ...expenses] : [expense]);
        }}
      />
      {expenses ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {expenses.map((expense) => {
            return (
              <Col key={expense._id}>
                <Expense
                  key={expense._id}
                  {...expense}
                  deleteExpense={deleteExpense}
                />
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
