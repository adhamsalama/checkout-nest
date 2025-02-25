import { Route, Routes } from "react-router";
import Dashboard from "./components/Dashboard";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { getUser } from "./utils";
import { Link } from "react-router-dom";
import Auth from "./components/Auth";
import { ListExpenses } from "./components/ListExpenses";
import { SearchPage } from "./components/SearchPage";
import PaymentPage from "./components/ListPayments";
import BudgetsPage from "./components/BudgetsPage";

function App() {
  const user = getUser();
  return (
    <Container>
      <Navbar bg="light" expand="lg" style={{ marginBottom: "20px" }}>
        <Container>
          <Navbar.Brand href="/">Checkout</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <Nav.Link href="/payments">Payments</Nav.Link>
              <Nav.Link href="/budgets">Budgets</Nav.Link>
              <Nav.Link href="/search">Search</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {user ? (
                `Signed in as: ${user.email}`
              ) : (
                <Link to="/auth">Sign in</Link>
              )}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<ListExpenses />} />
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
      </Routes>{" "}
    </Container>
  );
}

export default App;
