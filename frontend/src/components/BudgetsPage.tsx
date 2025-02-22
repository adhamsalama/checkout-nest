import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Modal, Form } from "react-bootstrap";
import { config } from "../../config";

interface Budget {
  id: number;
  name: string;
  value: number;
}

interface TaggedBudget extends Budget {
  intervalInDays: number;
  tag: string
}

const BudgetCard: React.FC<{ budget: Budget; onEdit: () => void; onDelete: () => void }> = ({ budget, onEdit, onDelete }) => (
  <Col md={4} className="mb-3">
    <Card>
      <Card.Body>
        <Card.Title>{budget.name}</Card.Title>
        <Card.Text>Value: ${budget.value}</Card.Text>
        <Button variant="warning" onClick={onEdit} className="me-2">
          Edit
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  </Col>
);


const BudgetPage: React.FC = () => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    fetch(`${config.baseUrl}/budgets/monthly`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBudget(data);
        setName(data.name);
        setValue(data.value);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSaveBudget = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const method = budget ? "PUT" : "POST";
    const url = `${config.baseUrl}/budgets/monthly`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, value }),
    })
      .then((response) => response.json())
      .then((data: Budget) => {
        setBudget(data);
        setShowModal(false);
      })
      .catch((error) => alert(error));
  };

  const handleDeleteBudget = () => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      fetch(`${config.baseUrl}/budgets/monthly`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(() => {
          setBudget(null);
          setName("");
          setValue(0);
        })
        .catch((error) => alert(error));
    }
  };

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
          >
            {budget ? "Edit Monthly Budget" : "Add Monthly Budget"}
          </Button>
        </Col>
      </Row>
      <Row>
        {budget && <BudgetCard budget={budget} onEdit={() => setShowModal(true)} onDelete={handleDeleteBudget} />}
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{budget ? "Edit Budget" : "Add Budget"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveBudget}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter budget name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="value" className="mt-3">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter budget value"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save Budget
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <TaggedBudgetManager></TaggedBudgetManager>
      <BudgetStats></BudgetStats>
    </Container>
  );
};



async function getBudgets(): Promise<TaggedBudget[]> {
  const url = config.baseUrl + `/budgets/tagged`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const json = response.json();
  console.log({ json })
  return json;
}

async function saveBudget(budget: Omit<TaggedBudget, "id">): Promise<TaggedBudget> {
  const url = config.baseUrl + `/budgets/tagged`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(budget),
  });
  const json = await res.json() as TaggedBudget;
  return json;
}

async function deleteBudgetApi(id: number) {
  const url = config.baseUrl + `/budgets/tagged/${id}`;
  await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

const TaggedBudgetManager: React.FC = () => {
  const [budgets, setBudgets] = useState<TaggedBudget[]>([]);
  const [newTaggedBudget, setNewTaggedBudget] = useState<Omit<TaggedBudget, "id">>({
    name: "",
    value: 0,
    intervalInDays: 0,
    tag: "",
  });

  useEffect(() => {
    getBudgets().then(setBudgets);
  }, []);

  const addBudget = async () => {
    const savedBudget = await saveBudget(newTaggedBudget);
    setBudgets([...budgets, savedBudget]);
    setNewTaggedBudget({ name: "", value: 0, intervalInDays: 0, tag: "" });
  };

  return (
    <div>
      <Form>
        <h2>Create Tagged Budget</h2>
        <Form.Group className="mb-2">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={newTaggedBudget.name}
            onChange={(e) =>
              setNewTaggedBudget({ ...newTaggedBudget, name: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Value</Form.Label>
          <Form.Control
            type="number"
            value={newTaggedBudget.value}
            onChange={(e) =>
              setNewTaggedBudget({
                ...newTaggedBudget,
                value: parseFloat(e.target.value),
              })
            }
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Interval in Days</Form.Label>
          <Form.Control
            type="number"
            value={newTaggedBudget.intervalInDays}
            onChange={(e) =>
              setNewTaggedBudget({
                ...newTaggedBudget,
                intervalInDays: parseInt(e.target.value),
              })
            }
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Tag</Form.Label>
          <Form.Control
            type="text"
            value={newTaggedBudget.tag}
            onChange={(e) =>
              setNewTaggedBudget({ ...newTaggedBudget, tag: e.target.value })
            }
          />
        </Form.Group>
        <Button variant="primary" onClick={addBudget}>
          Add Budget
        </Button>
      </Form>
    </div>
  );
};
;
interface GetTaggedBudgetStats {
  id: number;
  name: string;
  value: number;
  intervalInDays: number;
  totalPrice: { value: number } | null;
}
async function getBudgetStats(): Promise<GetTaggedBudgetStats[]> {
  const url = config.baseUrl + `/budgets/tagged/stats`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.json();
}

const BudgetStatCard: React.FC<{ stat: GetTaggedBudgetStats, onDelete: () => void }> = ({ stat, onDelete }) => {
  const spent = -(stat.totalPrice ?? 0);
  const remaining = stat.value - spent;
  const percentageLeft = (remaining / stat.value) * 100;

  let bgColor = "bg-danger";
  if (percentageLeft >= 75) bgColor = "bg-success";
  else if (percentageLeft >= 50) bgColor = "bg-primary";
  else if (percentageLeft >= 25) bgColor = "bg-warning";

  return (
    <Card className={`mb-3 text-white ${bgColor}`}>
      <Card.Body>
        <Card.Title>{stat.name}</Card.Title>
        <Card.Text>
          <strong>Budget:</strong> ${stat.value.toFixed(2)} <br />
          <strong>Spent:</strong> ${spent.toFixed(2)} <br />
          <strong>Remaining:</strong> ${remaining.toFixed(2)} <br />
          <strong>Interval:</strong> {stat.intervalInDays} days <br />
        </Card.Text>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
};

const BudgetStats: React.FC = () => {
  const [budgetStats, setBudgetStats] = useState<GetTaggedBudgetStats[]>([]);

  useEffect(() => {
    getBudgetStats().then(setBudgetStats);
  }, []);
  const deleteBudget = async (id: number) => {
    await deleteBudgetApi(id);
    setBudgetStats(budgetStats.filter((budget) => budget.id !== id));
  };
  return (
    <div>
      <h2>Budget Stats</h2>
      {budgetStats.map((stat) => (
        <BudgetStatCard key={stat.id} stat={stat}
          onDelete={() => deleteBudget(stat.id)}
        />
      ))}
    </div>
  );
};

export default BudgetPage;

