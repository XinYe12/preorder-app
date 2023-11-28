// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);

const CREATE_DEFERRED_PURCHASE_MUTATION = `
mutation sellingPlanGroupCreate($input: SellingPlanGroupInput!) {
  sellingPlanGroupCreate(input: $input) {
    sellingPlanGroup {
      id
    }
    userErrors {
      field
      message
    }
  }
}`;
app.post("/api/deferred-purchase/create", async (req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const data = await client.query({
    data: {
      query: CREATE_DEFERRED_PURCHASE_MUTATION,
      variables: req.body,
    },
  });

  res.send(data.body);
});
const GET_DEFERRED_PURCHASES_QUERY = `
query SellingPlanGroupsList {
  sellingPlanGroups(first: 10) {
    edges {
      cursor
      node {
        id
        name
        createdAt
        productCount
        summary
      }
    }
  }
}
`;
app.get("/api/deferred-purchase", async (req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
});

const data = await client.query({
  data: {
    query: GET_DEFERRED_PURCHASES_QUERY,
  }
});
res.send(data.body);
});


