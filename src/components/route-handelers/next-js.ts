import BetterStore from "@betterstore/sdk";
import { type NextRequest } from "next/server";

type NextjsRouteConfig = {
  allowedOrigins?: string[];
};

type BSClient = InstanceType<typeof BetterStore>;

type BetterStoreRouteHandler = {
  GET?: (req: NextRequest, betterStore: BSClient) => Promise<Response>;
  POST?: (req: NextRequest, betterStore: BSClient) => Promise<Response>;
  PUT?: (req: NextRequest, betterStore: BSClient) => Promise<Response>;
  DELETE?: (req: NextRequest, betterStore: BSClient) => Promise<Response>;
};

const defaultBetterStoreRoutes: Record<string, BetterStoreRouteHandler> = {
  checkout: {
    GET: async (req: NextRequest, betterStore: BSClient) => {
      const { searchParams } = new URL(req.url);
      const checkoutId = searchParams.get("checkoutId");

      if (!checkoutId) {
        return new Response("Checkout ID is required", { status: 400 });
      }

      try {
        const checkout = await betterStore.checkout.retrieve(checkoutId);
        return Response.json(checkout);
      } catch (error) {
        return new Response("Failed to fetch checkout", { status: 500 });
      }
    },
    POST: async (req: NextRequest, betterStore: BSClient) => {
      try {
        const body = await req.json();
        const checkout = await betterStore.checkout.create(body);
        return Response.json(checkout);
      } catch (error) {
        return new Response("Failed to create checkout", { status: 500 });
      }
    },
    PUT: async (req: NextRequest, betterStore: BSClient) => {
      const { searchParams } = new URL(req.url);
      const checkoutId = searchParams.get("checkoutId");

      if (!checkoutId) {
        return new Response("Checkout ID is required", { status: 400 });
      }

      try {
        const body = await req.json();
        const checkout = await betterStore.checkout.update(checkoutId, body);
        return Response.json(checkout);
      } catch (error) {
        return new Response("Failed to update checkout", { status: 500 });
      }
    },
  },
  "checkout/shipping": {
    GET: async (req: NextRequest, betterStore: BSClient) => {
      const { searchParams } = new URL(req.url);
      const checkoutId = searchParams.get("checkoutId");

      if (!checkoutId) {
        return new Response("Checkout ID is required", { status: 400 });
      }

      try {
        const rates = await betterStore.checkout.getShippingRates(checkoutId);
        return Response.json(rates);
      } catch (error) {
        return new Response("Failed to get shipping rates", { status: 500 });
      }
    },
  },
  "checkout/payment": {
    POST: async (req: NextRequest, betterStore: BSClient) => {
      const { searchParams } = new URL(req.url);
      const checkoutId = searchParams.get("checkoutId");

      if (!checkoutId) {
        return new Response("Checkout ID is required", { status: 400 });
      }

      try {
        const secret =
          await betterStore.checkout.generatePaymentSecret(checkoutId);
        return Response.json({ clientSecret: secret });
      } catch (error) {
        return new Response("Failed to generate payment secret", {
          status: 500,
        });
      }
    },
  },
  customer: {
    GET: async (req: NextRequest, betterStore: BSClient) => {
      const { searchParams } = new URL(req.url);
      const idOrEmail = searchParams.get("idOrEmail");

      if (!idOrEmail) {
        return new Response("Customer ID or email is required", {
          status: 400,
        });
      }

      try {
        const customer = await betterStore.customer.retrieve(idOrEmail);
        return Response.json(customer);
      } catch (error) {
        return new Response("Failed to fetch customer", { status: 500 });
      }
    },
    POST: async (req: NextRequest, betterStore: BSClient) => {
      try {
        const body = await req.json();
        const customer = await betterStore.customer.create(body);
        return Response.json(customer);
      } catch (error) {
        return new Response("Failed to create customer", { status: 500 });
      }
    },
    PUT: async (req: NextRequest, betterStore: BSClient) => {
      const { searchParams } = new URL(req.url);
      const customerId = searchParams.get("customerId");

      if (!customerId) {
        return new Response("Customer ID is required", { status: 400 });
      }

      try {
        const body = await req.json();
        const customer = await betterStore.customer.update(customerId, body);
        return Response.json(customer);
      } catch (error) {
        return new Response("Failed to update customer", { status: 500 });
      }
    },
    DELETE: async (req: NextRequest, betterStore: BSClient) => {
      const { searchParams } = new URL(req.url);
      const customerId = searchParams.get("customerId");

      if (!customerId) {
        return new Response("Customer ID is required", { status: 400 });
      }

      try {
        await betterStore.customer.delete(customerId);
        return new Response(null, { status: 204 });
      } catch (error) {
        return new Response("Failed to delete customer", { status: 500 });
      }
    },
  },
  product: {
    GET: async (req: NextRequest, betterStore: BSClient) => {
      const { searchParams } = new URL(req.url);
      const productId = searchParams.get("productId");

      try {
        if (productId) {
          const product = await betterStore.product.retrieve(productId);
          return Response.json(product);
        } else {
          const products = await betterStore.product.list();
          return Response.json(products);
        }
      } catch (error) {
        return new Response("Failed to fetch products", { status: 500 });
      }
    },
  },
};

export function createNextJSHandler(
  betterStore: BSClient,
  config: NextjsRouteConfig = {}
) {
  const { allowedOrigins = [] } = config;

  async function validateRequest(req: NextRequest): Promise<Response | null> {
    if (allowedOrigins.length > 0) {
      const origin = req.headers.get("origin");
      if (!origin || !allowedOrigins.includes(origin)) {
        return new Response("Unauthorized", { status: 403 });
      }
    }
    return null;
  }

  function getRouteFromPath(pathname: string): string {
    // Remove leading and trailing slashes and 'api' prefix if present
    const cleanPath = pathname.replace(/^\/|\/$/g, "").replace(/^api\//, "");
    // Get the relevant part of the path (everything after betterstore/)
    const relevantPath = cleanPath.split("betterstore/")[1] || "";
    return relevantPath;
  }

  return {
    async GET(req: NextRequest) {
      const validationError = await validateRequest(req);
      if (validationError) return validationError;

      const route = getRouteFromPath(new URL(req.url).pathname);
      const handler = defaultBetterStoreRoutes[route]?.GET;

      if (!handler) {
        return new Response(`Route not found: ${route}`, { status: 404 });
      }

      return handler(req, betterStore);
    },

    async POST(req: NextRequest) {
      const validationError = await validateRequest(req);
      if (validationError) return validationError;

      const route = getRouteFromPath(new URL(req.url).pathname);
      const handler = defaultBetterStoreRoutes[route]?.POST;

      if (!handler) {
        return new Response(`Route not found: ${route}`, { status: 404 });
      }

      return handler(req, betterStore);
    },

    async PUT(req: NextRequest) {
      const validationError = await validateRequest(req);
      if (validationError) return validationError;

      const route = getRouteFromPath(new URL(req.url).pathname);
      const handler = defaultBetterStoreRoutes[route]?.PUT;

      if (!handler) {
        return new Response(`Route not found: ${route}`, { status: 404 });
      }

      return handler(req, betterStore);
    },

    async DELETE(req: NextRequest) {
      const validationError = await validateRequest(req);
      if (validationError) return validationError;

      const route = getRouteFromPath(new URL(req.url).pathname);
      const handler = defaultBetterStoreRoutes[route]?.DELETE;

      if (!handler) {
        return new Response(`Route not found: ${route}`, { status: 404 });
      }

      return handler(req, betterStore);
    },
  };
}
