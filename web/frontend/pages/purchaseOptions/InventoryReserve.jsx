import { useCallback } from "react";
import { Card, Stack, RadioButton } from "@shopify/polaris";
import { sellingPlanReserve } from "../../constants.js";

const InventoryReserve = ({ inventoryReservation, onChange }) => {
  const handleChange = useCallback(
    (_checked, newValue) => onChange(newValue),
    []
  );

  return (
    <Card title="Inventory" sectioned>
      <Stack vertical>
        <RadioButton
          label="On Sale"
          helpText="The inventory is updated when the order is created."
          id={sellingPlanReserve.OnSale}
          onChange={handleChange}
          checked={inventoryReservation === sellingPlanReserve.OnSale}
        />
        <RadioButton
          label="On Fulfillment"
          helpText="The inventory is updated when the order is fulfilled."
          id={sellingPlanReserve.OnFulfillment}
          onChange={handleChange}
          checked={inventoryReservation === sellingPlanReserve.OnFulfillment}
        />
      </Stack>
    </Card>
  );
};

export default InventoryReserve;
