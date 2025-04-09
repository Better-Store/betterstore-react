import { createStoreClient } from "@betterstore/sdk";

export const storeClient = createStoreClient({ proxy: "/api/betterstore" });
