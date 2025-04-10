import { createStoreClient, createStoreHelpers } from "@betterstore/sdk";

export const storeClient = createStoreClient({ proxy: "/api/betterstore" });
export const storeHelpers = createStoreHelpers();
