
import { useEffect, useState } from "react";
import { Expense as ExpenseType, User } from "../types";
import { getExpenses, getUser } from "../utils";
import { Expense } from "./Expense";
import { Button, Col, Modal, Row, Alert } from "react-bootstrap";
import AddProduct from "./AddExpense";
import { HTTPMethod, io } from "../api";
import { config } from "../../config";

export function ListExpenses() {
  function deleteExpense(id: number) {
    user!.balance += expenses!.find((expense) => expense.id === id)!.price;
    setExpenses(expenses?.filter((expense) => expense.id !== id));
  }
  const userData = getUser();
  if (!userData) return <h1>Login</h1>;
  const token = localStorage.getItem("token");

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

  const { data: budget } = io(
    `${config.baseUrl}/budgets/monthly`,
    HTTPMethod.GET,
    null,
    {
      Authorization: `Bearer ${token}`,
    }
  ) as { data?: { name: string; value: number } };

  const { data: currentMonthSum } = io(
    `${config.baseUrl}/expenses/current-month-sum`,
    HTTPMethod.GET,
    null,
    {
      Authorization: `Bearer ${token}`,
    }
  ) as { data?: number };

  const [expenses, setExpenses] = useState<ExpenseType[]>();
  const [offset, setOffset] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);
  const [remainingBudget, setRemainingBudget] = useState<number | null>(null);
  const [alertVariant, setAlertVariant] = useState("success");
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

  useEffect(() => {
    if (budget && currentMonthSum !== undefined) {
      const spent = -currentMonthSum;
      const remaining = budget.value - spent;
      setRemainingBudget(remaining);

      const budgetPercentage = (remaining / budget.value) * 100;
      if (budgetPercentage >= 75) setAlertVariant("success");
      else if (budgetPercentage >= 50) setAlertVariant("primary");
      else if (budgetPercentage >= 25) setAlertVariant("warning");
      else setAlertVariant("danger");

      if (spent > budget.value) {
        setWarning("Warning: Your current expenses exceed your monthly budget!");
      } else {
        setWarning(null);
      }
    }
  }, [budget, currentMonthSum]);

  const [showEditModal, setShowEditModal] = useState(false);
  return (
    <>
      <h1>Balance: ${balance ?? 0}</h1>
      {budget && currentMonthSum !== undefined && (
        <>
          <h2>Spent This Month: ${-currentMonthSum}</h2>
          <h2>Monthly Budget: ${budget.value}</h2>
        </>
      )}
      {remainingBudget !== null && (
        <Alert variant={alertVariant}>Remaining Budget: ${remainingBudget}</Alert>
      )}
      {warning && <Alert variant="danger">{warning}</Alert>}
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

