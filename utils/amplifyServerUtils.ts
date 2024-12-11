import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { ResourcesConfig, AuthConfig } from "@aws-amplify/core";

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
export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});
