import jwt_decode from "jwt-decode";
import { config } from "../config";
import { Expense } from "./types";

export function getUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const user: { _id: string; email: string } | null = jwt_decode(token);
  return user;
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
