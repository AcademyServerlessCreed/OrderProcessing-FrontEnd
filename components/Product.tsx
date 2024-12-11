"use client";
import { fetchItemsAndImages } from "@/actions/product.action";
import { useCartContext } from "@/context/CartContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Product {
  Id: string;
  Name: string;
  Quantity: number;
  ImageName: string;
  Image: Blob;
}

interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

function Product() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [addingStates, setAddingStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedQuantities, setSelectedQuantities] = useState<{
    [key: string]: number;
  }>({});
  const { addToCart: addToCartContext } = useCartContext(); // Rename the context function

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchItemsAndImages();
        setProducts(result);
        setIsLoading(false);
      } catch (error: any) {
        setError(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) return <div>Failed to load: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  const handleQuantityChange = (productId: string, quantity: number) => {
    const product = products.find((p) => p.Id === productId);
    if (product) {
      const validQuantity = Math.min(Math.max(quantity, 1), product.Quantity);
      setSelectedQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: validQuantity,
      }));
    }
  };

  const addToCart = (product: Product) => {
    setAddingStates((prevStates) => ({
      ...prevStates,
      [product.Id]: true,
    }));
    setTimeout(() => {
      setAddingStates((prevStates) => ({
        ...prevStates,
        [product.Id]: false,
      }));
      const quantity = selectedQuantities[product.Id] || 1;
      const cartItem: CartItem = {
        id: product.Id,
        name: product.Name,
        quantity,
      };
      addToCartContext(cartItem); // Use the renamed context function
    }, 1000);
  };
  return (
    <div className="mt-2 w-full">
      <h1>Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mt-4 justify-evenly">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.Id}
              className="flex flex-col gap-2 justify-evenly items-center"
            >
              <Image
                src={URL.createObjectURL(product.Image)}
                alt={product.Name}
                width={100}
                height={100}
              />
              <h2>Name : {product.Name}</h2>
              <p>Quantity: {product.Quantity}</p>
              <Input
                type="number"
                max={product.Quantity}
                className="w-auto"
                value={
                  selectedQuantities[product.Id]
                    ? selectedQuantities[product.Id]
                    : 1
                }
                onChange={(e) =>
                  handleQuantityChange(product.Id, parseInt(e.target.value))
                }
              />
              <Button
                disabled={
                  addingStates[product.Id] ||
                  selectedQuantities[product.Id] === 0 ||
                  selectedQuantities[product.Id] > product.Quantity ||
                  product.Quantity === 0
                }
                onClick={() => addToCart(product)}
              >
                {addingStates[product.Id]
                  ? "Adding..."
                  : selectedQuantities[product.Id] > product.Quantity
                  ? "Not Availabe"
                  : product.Quantity === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </Button>
            </div>
          ))
        ) : (
          <div>No products found</div>
        )}
      </div>
    </div>
  );
}

export default Product;
