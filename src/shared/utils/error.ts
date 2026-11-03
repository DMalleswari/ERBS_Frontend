import axios from "axios";

type ErrorBody = {
  message?: string;
  errors?: Array<{ message?: string }>;
};

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorBody>(error)) {
    const body = error.response?.data;
    const detail = body?.errors?.find((item) => item.message)?.message;
    if (body?.message && detail) return `${body.message}: ${detail}`;
    if (body?.message) return body.message;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}
