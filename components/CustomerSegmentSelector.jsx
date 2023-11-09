import React, { useState } from "react";
import { TextField, Icon, Button } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";

import CustomerSegmentsPicker from "./CustomerSegmentPicker";

export default function CustomerSegmentSelector({
  selectedCustomerSegments,
  setSelectedCustomerSegments,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div>
      <TextField
        placeholder="Search customer segment"
        labelHidden
        onChange={(nextSearchQuery) => {
          setSearchQuery(nextSearchQuery);
          setIsOpen(true);
        }}
        value={searchQuery}
        autoComplete="off"
        prefix={<Icon source={SearchMinor} color="subdued" />}
        connectedRight={
          <div>
            <Button
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Browse
            </Button>
          </div>
        }
      />
      {/* <CustomerSegmentsPicker
        isOpen={isOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        initialSelectedItems={selectedCustomerSegments}
        onCancel={() => setIsOpen(false)}
        onSelect={(customerSegments) => {
          setIsOpen(false);
          setSelectedCustomerSegments(customerSegments);
        }}
      /> */}
    </div>
  );
}
