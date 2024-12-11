"use client";

import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
interface Product {
  Id: string;
  Name: string;
  Quantity: number;
  ImageName: string;
}
const dynamodbClient = new DynamoDBClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET as string,
  },
});
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET as string,
  },
});

const TABLE_NAME = process.env.NEXT_PUBLIC_PRODUCT_TABLE;
const BUCKET_NAME = process.env.NEXT_PUBLIC_BUCKET;

async function fetchItemsFromDynamoDB() {
  const params = {
    TableName: TABLE_NAME,
    // AttributesToGet: ["PK", "SK"],
  };

  try {
    const data = await dynamodbClient.send(new ScanCommand(params));
    console.log(data.Items);
    return data.Items;
  } catch (error) {
    console.error("Error fetching items from DynamoDB:", error);
    throw error;
  }
}

async function fetchImageFromS3(imageName: string) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: imageName,
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(params));
    if (!data.Body) {
      throw new Error("No data body returned from S3");
    }

    const imageBlob = await data.Body.transformToByteArray();
    return new Blob([imageBlob], { type: "image/jpeg" });
  } catch (error: any) {
    console.error(`Error fetching image ${imageName} from S3:`, error);
    throw error;
  }
}

async function fetchItemsAndImages() {
  try {
    const items = (await fetchItemsFromDynamoDB()) || [];
    const products: Product[] = [];

    for (const item of items) {
      const product: Product = {
        Id: item?.ProductID.S || "",
        Name: item?.Name.S || "",
        Quantity: item?.stock.N ? parseInt(item.stock.N, 10) : 0,
        ImageName: item?.ImageName.S || "",
      };
      products.push(product);
    }

    const imagePromises = products.map((product) =>
      fetchImageFromS3(product.ImageName)
    );
    const images = await Promise.all(imagePromises);

    const productsWithImages = products.map((product, index) => ({
      ...product,
      Image: images[index],
    }));

    console.log("Fetched products:", productsWithImages);
    return productsWithImages;
  } catch (error) {
    console.error("Error fetching products and images:", error);
    throw error;
  }
}

export { fetchItemsAndImages };
