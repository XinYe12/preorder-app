import { useState, useCallback } from "react";
import { ResourcePicker } from "@shopify/app-bridge-react";
import {
  Card,
  Button,
  ResourceList,
  ResourceItem,
  TextStyle,
  Thumbnail,
  Stack,
} from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";

const ProductsSelection = ({ productsList, onChange }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const handleProductsSelection = useCallback((resources) => {
    setPickerOpen(false);
    onChange(resources);
  });

  return (
    <>
      <Card
        title="Select products that will have the deferred purchase option"
        sectioned
      >
        <Stack spacing="loose" vertical>
          {productsList.selection && (
            <ResourceList
              resourceName={{ singular: "product", plural: "products" }}
              items={productsList.selection}
              renderItem={(item) => {
                const { id, title, images } = item;
                const media = (
                  <Thumbnail
                    size="small"
                    source={images[0]?.originalSrc ?? ImageMajor}
                    alt={images[0]?.altText ?? title}
                  />
                );

                return (
                  <ResourceItem id={id} media={media}>
                    <h3>
                      <TextStyle variation="strong">{title}</TextStyle>
                    </h3>
                  </ResourceItem>
                );
              }}
            />
          )}
          <Stack distribution="trailing">
            <Button onClick={() => setPickerOpen(true)}>Select products</Button>
          </Stack>
        </Stack>
      </Card>
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        open={pickerOpen}
        onSelection={(resources) => handleProductsSelection(resources)}
        onCancel={() => setPickerOpen(false)}
      />
    </>
  );
};

export default ProductsSelection;
