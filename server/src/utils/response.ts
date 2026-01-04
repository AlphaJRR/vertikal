import { Response } from 'express';

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  error?: string;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    status: 'success',
    ...(message && { message }),
    data,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 400
): Response => {
  const response: ApiResponse = {
    status: 'error',
    error: message,
  };
  return res.status(statusCode).json(response);
};


