
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
      {
        ...init,
        headers: {
          Accept: "application/json",
          ...init?.headers,
        },
      },
    );
  } catch {
    throw new ApiError(
      "Unable to reach the server. Check that the FastAPI backend is running.",
      0,
    );
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    let message = `Request failed (${response.status})`;

    if (body) {
      try {
        const parsed: unknown = JSON.parse(body);

        if (
          typeof parsed === "object" &&
          parsed !== null &&
          "detail" in parsed
        ) {
          const detail = (parsed as { detail: unknown }).detail;

          message =
            typeof detail === "string"
              ? detail
              : Array.isArray(detail)
                ? detail
                    .map((item) =>
                      typeof item === "object" &&
                      item !== null &&
                      "msg" in item
                        ? String(item.msg)
                        : String(item),
                    )
                    .join(", ")
                : message;
        } else if (
          typeof parsed === "object" &&
          parsed !== null &&
          "message" in parsed &&
          typeof (parsed as { message: unknown }).message === "string"
        ) {
          message = (parsed as { message: string }).message;
        } else {
          message = body;
        }
      } catch {
        message = body;
      }
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
