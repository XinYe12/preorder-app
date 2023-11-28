import { useCallback } from "react";
import { Card, TextField } from "@shopify/polaris";

const PurchaseOptionName = ({ purchaseOptionName, onChange }) => {
  const handleChange = useCallback((newValue) => {
    onChange(newValue);
  }, []);

  return (
    <Card title="Deferred purchase option" sectioned>
      <TextField
        label="Set the deferred purchase option name"
        placeholder="Name"
        value={purchaseOptionName}
        onChange={handleChange}
        autoComplete="off"
      />
    </Card>
  );
};

export default PurchaseOptionName;
