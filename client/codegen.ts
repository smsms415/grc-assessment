import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://kvoyiazqo6.execute-api.us-east-2.amazonaws.com/",
  documents: "src/gql/**/*.gql",
  generates: {
    "src/__generated__/index.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
