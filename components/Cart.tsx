// Cart.tsx
import { useCartContext } from "@/context/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { checkout } from "../actions/checkout.action"; // Import the checkout function

function Cart() {
  const { cartItems } = useCartContext();

  const handlePlaceOrder = async () => {
    try {
      // Map cartItems to the format expected by the checkout function
      const itemsToCheckout = cartItems.map((item) => ({
        itemId: item.id,
        quantity: item.quantity,
      }));
      const response = await checkout(itemsToCheckout);
      console.log("Order placed successfully:", response);
      // Optionally, redirect the user or give a success message
    } catch (error) {
      console.error("Error placing order:", error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Link href="/">
          <Button variant="link">← Back to Products</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Cart</CardTitle>
        </CardHeader>
        <CardContent>
          {cartItems.length === 0 ? (
            <p>No items in the cart</p>
          ) : (
            <>
              <ul className="space-y-2">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>Quantity: {item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-end">
                <Button onClick={handlePlaceOrder}>Place Order</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Cart;