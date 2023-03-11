import { Request } from 'express';
export type Optional<T> = T | null;
export type UserPayload = { id: string; email: string };
export interface MyRequest extends Request {
  user: UserPayload | undefined;
}
