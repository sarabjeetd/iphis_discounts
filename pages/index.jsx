import { useEffect, useMemo, useState, useCallback } from "react";
import isShopAvailable from "@/utils/middleware/isShopAvailable";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import {PrismaClient} from "@prisma/client";
import CustomerSelector from "../components/CustomerSelector";
import CustomerSegmentSelector from "../components/CustomerSegmentSelector";
import useFetch from "@/components/hooks/useFetch";
// import { useSubmit } from "@remix-run/react";
import {
  Form,
  Layout,
  LegacyCard,
  PageActions,
  Page,
  TextField,
  Text,
  VerticalStack,
  Card,
  Select,
  Banner,
  Button,
  ChoiceList,
  Stack,
  Modal,
  List,
  Frame,
  Checkbox,
} from "@shopify/polaris";
import CurrencyField from "../components/CurrencyField";
import { CurrencyCode } from "@shopify/react-i18n";
import { useForm, useField } from "@shopify/react-form";
import { useRouter } from "next/router";

import {
  RequirementType,
  DiscountClass,
  DiscountMethod,
  MethodCard,
  onBreadcrumbAction,
  SummaryCard,
  CombinationCard,
  ActiveDatesCard,
  DiscountStatus,
  CustomerEligibilityCard,
  Eligibility,
  MinimumRequirementsCard,
  AppliesTo
} from "@shopify/discount-app-components";

export async function getServerSideProps(context) {
  return await isShopAvailable(context);
}
export async function loader() {
  return null;
}

export async function action({ request }) {
  let formData = await request.formData();
  // let values = Object.fromEntries(formData);
  console.log(formData);
  return formData;
}
const HomePage = () => {
  // const submitForm = useSubmit();
  
  const fetch = useFetch();
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const app = useAppBridge();
  const isLoading = navigation.state === "submitting";
  const todaysDate = useMemo(() => new Date(), []);
  const currencyCode = CurrencyCode.Cad;
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState(
    CurrencyCode.Cad
  );
  const handleCurrencyCodeChange = (newValue) => {
    setSelectedCurrencyCode(newValue);
  };
  const [CurrencyCodeValue, setCurrencyCodeValue] = useState([]);
  const [selectedCustomerSegments, setSelectedCustomerSegments] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [eligibility, setEligibility] = useState(Eligibility.Customers);
  
  const [requirement, setRequirementType] = useState(RequirementType.None);
  const [subtotal, setSubtotal] = useState("");
  const [quantity, setQuantity] = useState("");


  
  const [selected, setSelected] = useState(["COLLECTIONS"]);
  const [active, setActive] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const handleSearch = (value) => {
    setSearchQuery(value);
  };
  const [collectionsData, setCollectionsData] = useState([]);
  const [productsData, setProductsData] = useState([]);
 
 

  
  const handleCollectionSelection = (collectionId, isChecked) => {
    if (isChecked) {
      setSelectedCollections((prev) => [...prev, collectionId]);
    } else {
      setSelectedCollections((prev) =>
        prev.filter((selectedId) => selectedId !== collectionId)
      );
    }
  };
  
  const handleProductSelection = (productId, isChecked) => {
    if (isChecked) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) =>
        prev.filter((selectedId) => selectedId !== productId)
      );
    }
  };
  
  const removeCollection = (collectionId) => {
    setSelectedCollections((prev) =>
      prev.filter((selectedId) => selectedId !== collectionId)
    );
  };

  const removeProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.filter((selectedId) => selectedId !== productId)
    );
  };

  const handleChangeModel = async () => {
    setActive(!active);
    
    if (selected[0] === "COLLECTIONS" || selected[0] === "PRODUCTS") {
      if (selected[0] === "COLLECTIONS") {
        try {
          const response = await fetch("/api/apps/collection");
          const collections = await response.json();
          console.log("collection_listtt: " + JSON.stringify(collections));
          setCollectionsData(collections.body.data.collections.edges);
        } catch (error) {
          console.error("Error fetching collections:", error);
        }
      } else {
        try {
          const response = await fetch("/api/apps/products");
          const products  = await response.json();
          const fetchedProducts = products.body.data.products.edges;
          console.log("p_listtt: " + JSON.stringify(fetchedProducts));
          setProductsData(fetchedProducts.map(product => ({
            id: product.node.id,
            name: product.node.title
          })));
          } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    }
  };

  
  const activator = <Button onClick={handleChangeModel}>Browser</Button>;

  const handleChange = async (value) => {
    if (value[0] === "COLLECTIONS") {
      setSelected(value);
      setActive(true);
      try {
        const response = await fetch("/api/apps/collection");
        const collections = await response.json();
        console.log("collection_listtt: " + JSON.stringify(collections));
        setCollectionsData(collections.body.data.collections.edges);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    } else if (value[0] === "PRODUCTS") {
      setSelected(value);
      setActive(true);
      try {
        const response = await fetch("/api/apps/products");
        const products  = await response.json();
        const fetchedProducts = products.body.data.products.edges;
        console.log("p_listtt: " + JSON.stringify(fetchedProducts));
        setProductsData(fetchedProducts.map(product => ({
          id: product.node.id,
          name: product.node.title
        })));
        } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
  };
  
  


  const prisma = new PrismaClient()
  const redirect = Redirect.create(app);
  const {
    fields: {
      discountTitle,
      discountCode,
      discountMethod,
      configuration,
      combinesWith,
      startDate,
      endDate,
      usageLimit,
      appliesOncePerCustomer,
    },
    submit,
  } = useForm({
    fields: {
      requirementType: useField(RequirementType.None),
      requirementSubtotal: useField("0"),
      requirementQuantity: useField("0"),
      discountTitle: useField(""),
      discountMethod: useField(DiscountMethod.Automatic),
      discountCode: useField(""),
      combinesWith: useField({
        orderDiscounts: false,
        productDiscounts: false,
        shippingDiscounts: false,
      }),
      eligibility :  useField(Eligibility.Customers),
      usageLimit: useField(null),
      appliesOncePerCustomer: useField(false),
      startDate: useField(todaysDate),
      endDate: useField(null),
      configuration: {
        quantity: useField("1"),
        amount: useField("0"),
        value: useField(""),
      },
    },
    onSubmit: async (form) => {
      let selectedItems = null;

      if (selected[0] === "COLLECTIONS") {
        selectedItems = selectedCollections.length > 0 ? selectedCollections : null;
      } else if (selected[0] === "PRODUCTS") {
        selectedItems = selectedProducts.length > 0 ? selectedProducts : null;
      } else {
        selectedItems = selectedProducts.length > 0 ? selectedProducts : null;
      }
      const isNumeric = (value) => {
        return /^\d+$/.test(value);
      };

      if (!isNumeric(configuration.quantity.value)) {
        setErrors((prevErrors) => [
          ...prevErrors,
          { field: ['Minimum quantity'], message: 'Please enter a valid quantity' },
        ]);
        return { status: 'failed' };
      }

      if (isNaN(parseFloat(CurrencyCodeValue)) || parseFloat(CurrencyCodeValue) <= 0) {
        setErrors((prevErrors) => [
          ...prevErrors,
          { field: ['Offer Amount'], message: 'Please enter a valid offer amount' },
        ]);
        return { status: 'failed' };
      }

      
      const discount = {
        title: form.discountTitle,
        method: form.discountMethod,
        code: form.discountCode,
        usageLimit: form.usageLimit == null ? null : parseInt(form.usageLimit),
        appliesOncePerCustomer: form.appliesOncePerCustomer,
        startsAt: form.startDate,
        endsAt: form.endDate,
        combinesWith: form.combinesWith,
        selectedCurrencyCode:selectedCurrencyCode,
        requirementType: requirement,
        requirementSubtotal: subtotal,
        requirementQuantity: quantity,
        eligibility: eligibility,
        selectedCollections: selected[0] === "COLLECTIONS" ? selectedItems : null,
        selectedProducts: selected[0] === "PRODUCTS" ? selectedItems : null,
        
        configuration: {
          quantity: parseInt(form.configuration.quantity),
          // quantity: quantity,
          amount: parseFloat(CurrencyCodeValue),
        },
      };

      console.log("Discount data:", discount);

      try {
        const response = await fetch('/api/apps/iphis_discount_product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ discount }),
        });

        if (response.ok) {
          console.log('Discount data submitted successfully!');
            redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
              name: Redirect.ResourceType.Discount,
            });
        } else {
          console.error('Failed to submit discount data');
          const errorData = await response.json();
          if (errorData.errors) {
            setErrors(errorData.errors);
          }
        }
      } catch (error) {
        console.error('Error submitting discount:', error);
      }

      return { status: "success" };

    },
  });

  const ErrorBanner = ({ errors }) => {
    const handleCancel = () => {
      router.back();
    };
    return (
      <Layout.Section>
         <Banner status="critical">
        <p>There were some issues with your form submission:</p>
        <ul>
          {errors.map(({ message, field }, index) => {
            const fieldName = field[field.length - 1];
            return (
              <li key={`${message}${index}`}>
                <strong>{fieldName}:</strong> {message}
              </li>
            );
          })}
        </ul>
      </Banner>
      </Layout.Section>
    );
  };
  const handleFormSubmit = (event) => {
    event.preventDefault();
    setErrors([]);
    submit();
  };
  
  return (
    <Page
      title="IPHIS product discount (Buy X for $Y)"
      backAction={{
        content: "Discounts",
        onAction: () => onBreadcrumbAction(redirect, true),
      }}
      primaryAction={{
        content: "Save",
        onAction: submit,
        loading: isLoading,
      }}
    >
      <Layout>
        {errors.length > 0 && <ErrorBanner errors={errors} />}
        <Layout.Section>
          <Form method="post" onSubmit={handleFormSubmit} >
            <VerticalStack align="space-around" gap="3">
            <Card>
              {/* <Text as="p">
                <span className="Polaris-Text--root Polaris-Text--headingMd">IPHIS</span>{" "}
                <span className="Polaris-Text--root Polaris-Text--subdued">Product discount</span>
              </Text> */}
              <VerticalStack align="space-around" gap="3">
                <Text variant="headingMd" as="h2">
                    Discount Title
                </Text>
                
                <TextField
                  label=""
                  placeholder="Buy X for $Y"
                  autoComplete="on"
                  {...discountTitle}
                />
                </VerticalStack>
                 </Card>
                 <Card>
                  <Text variant="headingMd" as="h2">
                    Quantity for offer to activate
                  </Text>
                  <TextField
                    label="Minimum quantity"
                    autoComplete="on"
                    {...configuration.quantity}
                  />
                  <span className="Polaris-Text--root Polaris-Text--subdued">
                    Number of items to buy before qualifying for purchase amount
                  </span>
                </Card>
      
                <Card>
                <VerticalStack align="space-around" gap="3">
                <Text variant="headingMd" as="h2">
                Offer Amount
                </Text>
                <CurrencyField
                  currencyCode={selectedCurrencyCode}
                  label=""
                  onChange={setCurrencyCodeValue}
                  value={CurrencyCodeValue}
                />
                </VerticalStack>
                <span className="Polaris-Text--root Polaris-Text--subdued">
                  Price of items
                </span>
                <VerticalStack align="space-around" gap="2">
                  
                <Text variant="headingMd" as="h2">
                   Apply to
                </Text>
                <ChoiceList
                  title=""
                  choices={[
                    { label: "Specific collections", value: "COLLECTIONS" },
                    { label: "Specific products", value: "PRODUCTS" },
                  ]}
                  selected={selected}
                  onChange={handleChange}
                />
                 </VerticalStack>
                 <VerticalStack gap="1">
                 <TextField
                    value={searchInput}
                    onChange={setSearchInput}
                    placeholder={
                      selected[0] === 'COLLECTIONS'
                        ? 'Search collections'
                        : 'Search products'
                    }
                    style={{ flex: 1 }}
                  />

                <div>
                      {selected[0] === "COLLECTIONS"
                        ? selectedCollections.map((collectionId) => {
                            const collection = collectionsData.find(
                              (c) => c.node.id === collectionId
                            );
                            return (
                              <div
                                key={collectionId}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: "5px",
                                  border: "1px solid #ccc",
                                  backgroundColor: "#f0f0f0",
                                  padding: "8px",
                                  borderRadius: "5px",
                                }}
                              >
                                <span style={{ flex: 1 }}>{collection.node.title}</span>
                                <button onClick={() => removeCollection(collectionId)}>❌</button>
                              </div>
                            );
                          })
                        : selectedProducts.map((productId) => {
                            const product = productsData.find((p) => p.id === productId);
                            return (
                              <div
                                key={productId}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: "5px",
                                  border: "1px solid #ccc",
                                  backgroundColor: "#f0f0f0",
                                  padding: "8px",
                                  borderRadius: "5px",
                                }}
                              >
                                <span style={{ flex: 1 }}>{product.name}</span>
                                <button onClick={() => removeProduct(productId)}>❌</button>
                              </div>
                            );
                          })}
                    </div>

                
                </VerticalStack>
                <VerticalStack gap="3">
                  <div>
                  <Modal
                    activator={activator}
                    open={active}
                    onClose={handleChangeModel}
                    title={selected[0] === "COLLECTIONS" ? "Add Collections" : "Add Products"}
                    primaryAction={{
                      content: "Add",
                      onAction: handleChangeModel,
                    }}
                    secondaryActions={[
                      {
                        content: "Cancel",
                        onAction: handleChangeModel,
                      },
                    ]}
                  >
                    <Modal.Section>
                    <VerticalStack gap="3">
                        <TextField
                          label={selected[0] === "COLLECTIONS" ? "Search collections" : "Search products"}
                          placeholder="Search"
                          value={searchQuery}
                          onChange={handleSearch}
                        />
                        <List>
                          
                        {selected[0] === "COLLECTIONS"
                              ? collectionsData
                                  .filter((collection) =>
                                    collection.node.title.toLowerCase().includes(searchQuery.toLowerCase())
                                  )
                                  .map((collection) => (
                                    <div key={collection.node.id} style={{ background: '#f0f0f0', padding: '10px', marginBottom: '10px' }}>
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={selectedCollections.includes(collection.node.id)}
                                          onChange={(e) =>
                                            handleCollectionSelection(collection.node.id, e.target.checked)
                                          }
                                        />
                                        <span>{collection.node.title}</span>
                                        {/* Replace 'collection.node.image' with the actual image URL */}
                                        {/* <img src={collection.node.image} alt={collection.node.title} /> */}
                                      </label>
                                    </div>
                                  ))
                              : productsData
                                  .filter((product) =>
                                    product.name.toLowerCase().includes(searchQuery.toLowerCase())
                                  )
                                  .map((product) => (
                                    <div key={product.id} style={{ background: '#f0f0f0', padding: '10px', marginBottom: '10px' }}>
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={selectedProducts.includes(product.id)}
                                          onChange={(e) =>
                                            handleProductSelection(product.id, e.target.checked)
                                          }
                                        />
                                        <span>{product.name}</span>
                                        {/* Replace 'product.image' with the actual image URL */}
                                        {/* <img src={product.image} alt={product.name} /> */}
                                      </label>
                                    </div>
                                  ))
                            }


                        </List>
                        </VerticalStack>
                      </Modal.Section>

                  </Modal>

                                      
                    </div>
                </VerticalStack>
                
              </Card>
                 <CustomerEligibilityCard
                    eligibility={{
                      value: eligibility,
                      onChange: setEligibility,
                    }}
                    selectedCustomerSegments={{
                      value: selectedCustomerSegments,
                      onChange: setSelectedCustomerSegments,
                    }}
                    selectedCustomers={{
                      value: selectedCustomers,
                      onChange: setSelectedCustomers,
                    }}
                    customerSelector={
                      <CustomerSelector
                        selectedCustomers={selectedCustomers}
                        setSelectedCustomers={setSelectedCustomers}
                      />
                    }
                    customerSegmentSelector={
                      <CustomerSegmentSelector
                        selectedCustomerSegments={selectedCustomerSegments}
                        setSelectedCustomerSegments={setSelectedCustomerSegments}
                      />
                    }
                  />
              {/* <Card>
                <Text variant="headingMd" as="h2">
                  Quantity for offer to activate
                </Text>
                <TextField
                  label="Minimum quantity"
                  autoComplete="on"
                  {...configuration.quantity}
                />
                <span className="Polaris-Text--root Polaris-Text--subdued">
                  Number of items to buy before qualifying for purchase amount
                </span>
              </Card> */}

              {/* <MinimumRequirementsCard
                    appliesTo={AppliesTo.Products}
                    currencyCode={CurrencyCode.Cad}
                    requirementType={{
                      value: requirement,
                      onChange: setRequirementType,
                    }}
                    subtotal={{
                      value: subtotal,
                      onChange: setSubtotal,
                    }}
                    quantity={{
                      value: quantity,
                      onChange: setQuantity,
                    }}
                    discountMethod={DiscountMethod.Automatic}
                    isRecurring
                  /> */}
                 
              <CombinationCard
                combinableDiscountTypes={combinesWith}
                discountClass={DiscountClass.Product}
                discountDescriptor={"Discount"}
              />
              <ActiveDatesCard
                startDate={startDate}
                endDate={endDate}
                timezoneAbbreviation="EST"
              />
            </VerticalStack>
          </Form>
        </Layout.Section>
        <Layout.Section secondary>
        <VerticalStack gap="3">
          <SummaryCard
            header={{
              discountMethod: discountMethod.value,
              discountDescriptor:
                discountMethod.value === DiscountMethod.Automatic
                  ? discountTitle.value
                  : discountCode.value,
              appDiscountType: "Volume",
              isEditing: false,
            }}
            performance={{
              status: DiscountStatus.Scheduled,
              usageCount: 0,
              isEditing: false,
            }}
            usageLimits={{
              oncePerCustomer: appliesOncePerCustomer.value,
              totalUsageLimit: usageLimit.value,
            }}
            
            minimumRequirements={{
              requirementType: requirement,
              subtotal: subtotal,
              quantity: quantity,
              currencyCode: currencyCode,
            }}
            combinations={{
              combinesWith: {
                orderDiscounts: combinesWith.value.orderDiscounts,
                productDiscounts: combinesWith.value.productDiscounts,
                shippingDiscounts: combinesWith.value.shippingDiscounts,
              },
            }}
            additionalDetails={[
              `Quantity: ${configuration.quantity.value}`,
              `Price: ${CurrencyCodeValue}`,
            ]}
            activeDates={{
              startDate: startDate.value,
              endDate: endDate.value,
            }}
          />
          </VerticalStack>
        </Layout.Section>
        <Layout.Section>
          <PageActions
            primaryAction={{
              content: "Save discount",
              onAction: submit,
              loading: isLoading,
            }}
            secondaryActions={[
              {
                content: "Discard",
                onAction: () => onBreadcrumbAction(redirect, true),
              },
            ]}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default HomePage;
