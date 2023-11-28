import { Page, Layout, Stack, PageActions } from "@shopify/polaris";import { useAppBridge, useNavigate } from "@shopify/app-bridge-react";
    import { useForm, useField } from "@shopify/react-form";
    import { useAuthenticatedFetch } from "../../hooks";
    import PurchaseOptionName from "../../components/purchaseOptions/PurchaseOptionName";
    import DepositSelection from "../../components/purchaseOptions/DepositSelection";
    import RemainingBalanceCharge from "../../components/purchaseOptions/RemainingBalanceCharge";
    import FulfillmentSelection from "../../components/purchaseOptions/FulfillmentSelection";
    import InventoryReserve from "../../components/purchaseOptions/InventoryReserve";
    import ProductsSelection from "../../components/purchaseOptions/ProductsSelection";
    import {
    depositValue,
    sellingPlanFulfillmentTrigger,
    sellingPlanReserve,
    sellingPlanRemainingBalanceChargeTrigger,
    } from "../../constants.js";

    export default function PurchaseOptionNew() {
    const app = useAppBridge();
    const navigate = useNavigate();
    const authenticatedFetch = useAuthenticatedFetch();
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    let data = null;

    const {
      fields: {
        name,
        deposit,
        remainingBalanceChargeExactTime,
        fulfillmentTrigger,
        inventoryReserve,
        productIds,
      },
      submit,
      submitting,
      dirty,
    } = useForm({
      fields: {
        name: useField(""),
        deposit: useField(depositValue.NoDeposit),
        remainingBalanceChargeExactTime: useField({
          start: currentDate,
          end: currentDate,
        }),
        fulfillmentTrigger: useField(sellingPlanFulfillmentTrigger.Asap),
        inventoryReserve: useField(sellingPlanReserve.OnSale),
        productIds: useField([]),
      },
      onSubmit: async (form) => {
        const floatDeposit = parseFloat(deposit.value);
        const remainingBalanceChargeTrigger =
          floatDeposit === 100
            ? sellingPlanRemainingBalanceChargeTrigger.NoRemainingBalance
            : sellingPlanRemainingBalanceChargeTrigger.ExactTime;
        const remainingBalanceChargeTime =
          remainingBalanceChargeTrigger ===
          sellingPlanRemainingBalanceChargeTrigger.ExactTime
            ? form.remainingBalanceChargeExactTime.start
            : null;
        const purchaseOptionsInput = {
          input: {
            name: form.name,
            merchantCode: "purchase-options",
            options: ["Purchase-Options"],
            position: 1,
            sellingPlansToCreate: [
              {
                name: form.name,
                options: "Purchase Options with deposit",
                category: "PRE_ORDER",
                billingPolicy: {
                  fixed: {
                    checkoutCharge: {
                      type: "PERCENTAGE",
                      value: {
                        percentage: parseFloat(form.deposit),
                      },
                    },
                    remainingBalanceChargeTrigger: remainingBalanceChargeTrigger,
                    remainingBalanceChargeExactTime: remainingBalanceChargeTime,
                  },
                },
                deliveryPolicy: {
                  fixed: {
                    fulfillmentTrigger: form.fulfillmentTrigger,
                  },
                },
                inventoryPolicy: {
                  reserve: form.inventoryReserve,
                },
              },
            ],
          },
          resources: {
            productIds: form.productIds,
          },
        };
        let response = await authenticatedFetch("/api/deferred-purchase/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(purchaseOptionsInput),
        });

        data = (await response.json()).data;
        const remoteErrors = data.sellingPlanGroupCreate.userErrors;
        if (remoteErrors.length > 0) {
          console.log("Errors", remoteErrors);
          return { status: "fail", errors: remoteErrors };
        }
        navigate("/");
        return { status: "success" };
      },
    });

    return (
      <Page
        title="Create Deferred Purchase Option"
        primaryAction={{
          content: "Save",
          onAction: submit,
          disabled: !dirty,
          loading: submitting,
        }}
      >
        <Layout>
          <Layout.Section>
            <form onSubmit={submit}>
              <PurchaseOptionName
                purchaseOptionName={name.value}
                onChange={name.onChange}
              />
              <DepositSelection
                depositAmount={deposit.value}
                onChange={deposit.onChange}
              />
              {deposit.value != 100 && (
                <RemainingBalanceCharge
                  remainBalanceChargeDate={remainingBalanceChargeExactTime.value}
                  onChange={remainingBalanceChargeExactTime.onChange}
                />
              )}
              <FulfillmentSelection
                fulfillmentTrigger={fulfillmentTrigger.value}
                onTypeChange={fulfillmentTrigger.onChange}
              />
              <InventoryReserve
                inventoryReservation={inventoryReserve.value}
                onChange={inventoryReserve.onChange}
              />
              <ProductsSelection
                productsList={productIds.value}
                onChange={productIds.onChange}
              />
              <Stack distribution="trailing"></Stack>
            </form>
          </Layout.Section>
          <Layout.Section>
            <PageActions
              primaryAction={{
                content: "Save deferred purchase option",
                onAction: submit,
                disabled: !dirty,
                loading: submitting,
              }}
              secondaryActions={[
                {
                  content: "Discard",
                  onAction: () => {
                    navigate("/");
                  },
                },
              ]}
            />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
