"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { del, get, post, put } from "aws-amplify/api";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fetchAuthSession } from "@aws-amplify/auth";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

const formSchema = z.object({
  image: z.instanceof(File).optional(),
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  quantity: z.string().min(1, {
    message: "Quantity must be at least 1.",
  }),
});

export function ProductForm() {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: null,
      name: "",
      quantity: "",
    },
  });

  const onSubmit = async (data: any) => {
    const authToken = (
      await fetchAuthSession()
    ).tokens?.accessToken?.toString();
    const userSub = (await fetchAuthSession()).userSub;

    try {
      setSubmitting(true);
      // Create FormData object and append form data
      const formData = new FormData();
      formData.append("file", data.image);
      formData.append("name", data.name);
      formData.append("quantity", data.quantity.toString());

      // Use the Amplify post function to send the request
      const PostData = post({
        apiName: "SFAPI", // replace with your API name
        path: "/uploadFile",
        options: {
          headers: {
            Authorization: authToken as string,
          },
          body: JSON.stringify({
            userId: userSub,
            fileName: data.image.name,
            name: data.name,
            quantity: data.quantity,
          }),
        },
      });

      // Handle response
      const response = (await PostData.response).body.text();

      const { uploadUrl } = JSON.parse(await response) as {
        uploadUrl: string;
      };
      const putData = await fetch(uploadUrl, {
        method: "PUT",
        body: data.image,
        headers: {
          "Content-Type": data.image.type,
        },
      });

      // Handle response

      if (putData.ok !== true) {
        toast({
          title: "Error",
          description: "Error creating product",
        });
      } else {
        toast({
          title: "Product created",
          description: "Product created successfully",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Link href="/">
          <Button variant="link">← Back to Products</Button>
        </Link>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        field.onChange(e.target.files[0]);
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Upload an image for the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product Name" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the name of the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the quantity of the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
