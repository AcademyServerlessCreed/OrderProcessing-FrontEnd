import { post } from "aws-amplify/api";
import { fetchAuthSession } from "@aws-amplify/auth";

interface ChecoutItem {
  itemId: string;
  quantity: number;
}

export async function checkout(items: ChecoutItem[]) {
  try {
    const authToken = (
      await fetchAuthSession()
    ).tokens?.accessToken?.toString();
    const response = await post({
      apiName: "SFAPI", // replace with your API name
      path: "/createOrder",
      options: {
        headers: {
          Authorization: authToken as string,
        },
        body: JSON.stringify(items),
      },
    });
    // Optionally handle the response, e.g., check for non-200 status codes

    return response; // or process it as needed
  } catch (error) {
    // Handle errors that occur during the fetch or processing
    console.error("Failed to complete checkout:", error);
    // Optionally rethrow the error or handle it differently
    throw error;
  }
}
