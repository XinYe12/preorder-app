import { useState } from "react";
import { useNavigate, TitleBar, Loading } from "@shopify/app-bridge-react";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  SkeletonBodyText,
  DataTable,
} from "@shopify/polaris";
import { useAppQuery } from "../hooks";

export default function HomePage() {
  /*
    Add an App Bridge useNavigate hook to set up the navigate function.
    This function modifies the top-level browser URL so that you can
    navigate within the embedded app and keep the browser in sync on reload.
  */
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { data } = useAppQuery({
    url: "/api/deferred-purchase",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const purchaseOptions = data
    ? data.data.sellingPlanGroups.edges.map((group) => {
        return [
          group.node.name,
          group.node.summary,
          group.node.productCount,
          group.node.createdAt,
        ];
      })
    : [];

  console.log(data, "data");

  /* loadingMarkup uses the loading component from AppBridge and components from Polaris  */
  const loadingMarkup = isLoading ? (
    <Card sectioned>
      <Loading />
      <SkeletonBodyText />
    </Card>
  ) : null;

  /* Use Polaris Card and EmptyState components to define the contents of the empty state */
  const emptyStateMarkup =
    !isLoading && !purchaseOptions?.length ? (
      <Card sectioned>
        <EmptyState
          heading="Create deferred purchase options"
          /* This button will take the user to a create a purchase option page */
          action={{
            content: "Create Purchase Option",
            onAction: () => navigate("/purchaseOptions/new"),
          }}
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>
            {" "}
            Deferred purchase options enable customers to purchase products with
            deferred payments or deliveries
          </p>
        </EmptyState>
      </Card>
    ) : (
       /* Use Polaris DataTable component to display the purchase options */
      <Card>
        <DataTable
          columnContentTypes={["text", "text", "numeric", "text"]}
          headings={["Name", "Summary", "Product Count", "Created At"]}
          rows={purchaseOptions}
        ></DataTable>
      </Card>
    );

  /*
    Use Polaris Page and TitleBar components to create the page layout,
    and include the empty state contents set above.
  */
  return (
    <Page>
      <TitleBar
        title="Deferred Purchase"
        primaryAction={{
          content: "Create Purchase Option",
          onAction: () => navigate("/purchaseOptions/new"),
        }}
      />
      <Layout>
        <Layout.Section>
          {loadingMarkup}
          {emptyStateMarkup}
        </Layout.Section>
      </Layout>
    </Page>
  );
}
