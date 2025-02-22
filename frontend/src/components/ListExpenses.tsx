import { useEffect, useState } from "react";
import { Expense as ExpenseType, User } from "../types";
import { getExpenses, getUser } from "../utils";
import { Expense } from "./Expense";
import { Button, Col, Modal, Row } from "react-bootstrap";
import AddProduct from "./AddExpense";
import { HTTPMethod, io } from "../api";
import { config } from "../../config";
import AddMonthlyBudget from "./AddMonthlyBudget";

export function ListExpenses() {
  function deleteExpense(id: number) {
    user!.balance += expenses!.find((expense) => expense.id === id)!.price;
    setExpenses(expenses?.filter((expense) => expense.id !== id));
  }
  const userData = getUser();
  if (!userData) return <h1>Login</h1>;
  const token = localStorage.getItem("token");
  // fetch user from api using his id

  const { data: user } = io(
    `${config.baseUrl}/users/${userData._id}`,
    HTTPMethod.GET,
    null,
    {
      Authorization: `Bearer ${token}`,
    }
  ) as { data?: User };
  const { data: balance } = io(
    `${config.baseUrl}/balance`,
    HTTPMethod.GET,
    null,
    {
      Authorization: `Bearer ${token}`,
    }
  ) as { data?: number };

  const [expenses, setExpenses] = useState<ExpenseType[]>();
  const [offset, setOffset] = useState(0);
  const OFFSET_STEP = 20;
  const handleScroll = async () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight;

    if (bottom) {
      setOffset(offset + OFFSET_STEP);
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMonthlyBudgetModal, setShowMonthlyBudgetModal] = useState(false);
  return (
    <>
      <h1>Balance: ${balance ?? 0}</h1>
      <Button
        variant="primary"
        onClick={() => setShowEditModal(true)}
        style={{ margin: "10px" }}
      >
        Add Expense
      </Button>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddProduct
            func={(expense: ExpenseType) => {
              setExpenses(expenses ? [expense, ...expenses] : [expense]);
              setShowEditModal(false);
              user!.balance -= expense.price;
            }}
          />
        </Modal.Body>
      </Modal>
      {expenses ? (
        <Row xs={1} md={2} lg={4} className="g-4">
          {expenses.map((expense) => {
            return (
              <Col key={expense.id}>
                <Expense
                  key={expense.id}
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
