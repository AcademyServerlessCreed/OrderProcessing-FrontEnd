"use client";

import { Amplify } from "aws-amplify";
import { ResourcesConfig } from "@aws-amplify/core";

const config: ResourcesConfig = {
  API: {
    REST: {
      SFAPI: {
        endpoint: process.env.NEXT_PUBLIC_APIGATEWAY_ENDPOINT as string,
        region: process.env.NEXT_PUBLIC_REGION as string,
      },
    },
  },
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID as string,
      signUpVerificationMethod: "code",
    },
  },
};

Amplify.configure(config, {
  ssr: true,
});
export default function ConfigureAmplifyClientSide() {
  return null;
}
