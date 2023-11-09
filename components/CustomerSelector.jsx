import React, { useState } from "react";
import { TextField, Icon, Button } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";

import CustomerPicker from "./CustomerPicker";

export default function CustomerSelector({
  selectedCustomers,
  setSelectedCustomers,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div>
      <TextField
        placeholder="Search customers"
        labelHidden
        onChange={(nextSearchQuery) => {
          setSearchQuery(nextSearchQuery);
          setIsOpen(true);
        }}
        value={searchQuery}
        autoComplete="off"
        prefix={<Icon source={SearchMinor} color="subdued" />}
        connectedRight={
          <Button
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Browse
          </Button>
        }
      />
      {/* <CustomerPicker
        isOpen={isOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        initialSelectedItems={selectedCustomers}
        onCancel={() => setIsOpen(false)}
        onSelect={(customers) => {
          setIsOpen(false);
          setSelectedCustomers(customers);
        }}
      /> */}
    </div>
  );
}
