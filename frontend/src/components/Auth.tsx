import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { config } from "../../config";

function Auth() {
  const [name, setName] = useState(""); // new state for name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = isSignUp ? "/users" : "/auth/login";

    const data = await fetch(config.baseUrl + url, {
      method: "POST",
      body: JSON.stringify({
        name, // new name field
        email,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());

    if (!data) alert("Wrong credentials");
    localStorage.setItem("token", data.access_token);
  };

  return (
    <>
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <Form onSubmit={submit}>
        {isSignUp && ( // new form control for name
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
            />
          </Form.Group>
        )}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </Form.Group>
        {isSignUp && (
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm Password" />
          </Form.Group>
        )}
        <Button variant="primary" type="submit">
          {isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </Form>
      {isSignUp ? (
        <p>
          Already have an account?{" "}
          <a href="#" onClick={() => setIsSignUp(false)}>
            Sign In
          </a>
        </p>
      ) : (
        <p>
          Don't have an account?{" "}
          <a href="#" onClick={() => setIsSignUp(true)}>
            Sign Up
          </a>
        </p>
      )}
    </>
  );
}

export default Auth;
