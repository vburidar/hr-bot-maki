export async function postRequest<T>(
  url: string,
  body: Record<string, any>,
  headers?: Record<string, string>
): Promise<T> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorMessage = `HTTP error! Status: ${response.status} - ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error("Error in postRequest:", error);
    throw error;
  }
}
