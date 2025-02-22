import jwt_decode from "jwt-decode";
import { config } from "../config";
import { Expense, User } from "./types";

export function getUser(): User | null {
  return { email: "test@test.test", balance: 1, _id: "a" }
  // const token = localStorage.getItem("token");
  // if (!token || token == "undefined") return null;
  //
  // const user: { sub: string; email: string; balance: number } | null =
  //   jwt_decode(token);
  // if (!user) return null;
  // return { ...user, _id: user.sub };
}

export async function getExpenses(
  offset = 0,
  limit = 10,
  date?: string
): Promise<Expense[]> {
  let url = config.baseUrl + `/expenses?limit=${limit}&offset=${offset}`;
  if (date) url += `&date=${date}`;
  const data = fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => res.json());
  return data;
}

export async function deleteExpense(id: number): Promise<Expense> {
  const data = fetch(config.baseUrl + `/expenses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => {
    console.log({ res });
    return res.json();
  });
  return data;
}

export async function updateExpense(
  expense: Omit<Expense, "userId">
): Promise<Expense> {
  const data = fetch(config.baseUrl + `/expenses/${expense.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  }).then((res) => res.json());
  return data;
}
