import { useEffect, useMemo, useState, useCallback } from "react";
import isShopAvailable from "@/utils/middleware/isShopAvailable";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import {PrismaClient} from "@prisma/client";
import CustomerSelector from "../components/CustomerSelector";
import CustomerSegmentSelector from "../components/CustomerSegmentSelector";

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
  Checkbox 
} from "@shopify/polaris";
import useFetch from "@/components/hooks/useFetch";
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
  
  const [requirementType2, setRequirementType] = useState(RequirementType.None);
  const [subtotal, setSubtotal] = useState("");
  const [quantity, setQuantity] = useState("");


  const ProductList = ["iphone", "laptop", "watch"]
  const Collections = ["electronics", "clothes", "videogames", "others"]
  
  const [selected, setSelected] = useState(["COLLECTIONS"]);
  const [Products, setProducts] = useState([]);
  const [active, setActive] = useState(false);
  const [checked, setChecked] = useState(false);
  const [collections, SetCollection] = useState(Collections);
  const [change, setChange] = useState(true);
  const [OnlyOne, setOnlyOne]=useState(false);
  const [selectedCollection, setSelectedCollection] = useState({
    CollectionsList: [],
    response: [],
  });
  const handleChangeModel = useCallback(() => setActive(!active), [active]);
  const activator = <Button onClick={handleChangeModel}>Browser</Button>;

  const handleChange = value => {
    if (value[0] == "COLLECTIONS") {
      setSelected(value);
      setChange(true);
      SetCollection(Collections);
    } else {
      setSelected(value);
      setChange(false);
      setProducts(ProductList);
    }
  };

  const handlerSearch = e => {
    if (e.target.value === "") {
      setProducts(ProductList);
      return;
    } 
    else {
      const FilterProductList = Products.filter(item =>
        item.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setProducts(FilterProductList);
    }
  };

  const handlerSearchSecond = e => {
    if (e.target.value === "") {
      SetCollection(Collections);
      return;
    } else {
      const FilterProductList = Collections.filter(item =>
        item.toLowerCase().includes(e.target.value.toLowerCase())
      );
      SetCollection(FilterProductList);
    }
  };

  const handleChangeCheckbox = e => {
    const { value, checked } = e.target;
    const { CollectionsList } = selectedCollection;
    console.log(`${value} is ${checked}`);
    if (checked) {
      setChecked(checked);
      setSelectedCollection({
        CollectionsList: [...CollectionsList, value],
      });
    } else {
      setChecked(checked);
      setSelectedCollection({
        CollectionsList: CollectionsList.filter(e => e !== value),
      });
    }
  };

  const prisma = new PrismaClient()
  const redirect = Redirect.create(app);
  const {
    fields: {
      requirementType,
      requirementSubtotal,
      requirementQuantity,
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
        configuration: {
          quantity: parseInt(form.configuration.quantity),
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
    submit();
  };
  
  return (
    <Page
      title="IPHIS product discount"
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
              <Text as="p">
                <span className="Polaris-Text--root Polaris-Text--headingMd">IPHIS</span>{" "}
                <span className="Polaris-Text--root Polaris-Text--subdued">Product discount</span>
              </Text>

                <Text variant="headingMd" as="h2">
                    Automatic discount
                </Text>
                <TextField
                  label="Title"
                  autoComplete="on"
                  {...discountTitle}
                />
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
                <CurrencyField
                  currencyCode={selectedCurrencyCode}
                  label="Offer Amount"
                  onChange={setCurrencyCodeValue}
                  value={CurrencyCodeValue}
                />
                <span className="Polaris-Text--root Polaris-Text--subdued">
                  Price of items
                </span>
                <ChoiceList
                  title="APPLY TO"
                  choices={[
                    { label: "Specific collections", value: "COLLECTIONS" },
                    { label: "Specific products", value: "PRODUCTS" },
                  ]}
                  selected={selected}
                  onChange={handleChange}
                />
                <VerticalStack>

                  {
                    change?(
                      <TextField  
                  {...configuration.value}
                  />
                    ):(
                      <TextField  
                  {...configuration.value}
                  />
                    )
                  }
                   <div>
                  {change ? (
                    <Modal
                    activator={activator}
                    open={active}
                    onClose={handleChangeModel}
                    title="Add collections"
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
                      <input
                          type="text"
                          onChange={handlerSearchSecond}
                          style={{
                            width: "90%",
                            padding: "10px",
                            marginLeft: "30px",
                          }}
                        />
                    <Modal.Section>
                      <Stack>
                        <form>
                          <List>
                          {collections &&
                                  collections.map((item, index) => {
                                    return (
                                      <List.Item key={index}>
                                        <input
                                          type="checkbox"
                                          value={item}
                                          checked={checked}
                                          onChange={handleChangeCheckbox}
                                        />
                                        <label>{item}</label>
                                      </List.Item>
                                    );
                                  })}
                          </List>
                        </form>
                      </Stack>
                    </Modal.Section>
                    </Modal>
                  ) : (
                    <Modal
                    activator={activator}
                    open={active}
                    onClose={handleChangeModel}
                    title="Add Products"
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
                            <input
                              type="text"
                              onChange={handlerSearch}
                              style={{
                                width: "90%",
                                padding: "10px",
                                marginLeft: "30px",
                              }}
                            />
                          <Modal.Section>
                              <Stack>
                                <form>
                                  <List>
                                    {Products &&
                                      Products.map((item, index) => {
                                        return (
                                          <List.Item key={index}>
                                            <Checkbox
                                              label={item}
                                              value={item}
                                              name={item}
                                              checked={checked}
                                              // onChange={handleChangeCheckbox}
                                            />
                                          </List.Item>
                                        );
                                      })}
                                  </List>
                                </form>
                              </Stack>
                            </Modal.Section>
                            </Modal>
                  )}    
                  </div>
                </VerticalStack>
                
              </Card>
              <MinimumRequirementsCard
                    appliesTo={AppliesTo.Products}
                    currencyCode={CurrencyCode.Cad}
                    requirementType={{
                      value: requirementType2,
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
                    discountMethod={DiscountMethod.Code}
                    isRecurring
                  />
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
            minimumRequirements={{
              requirementType: requirementType.value,
              subtotal: requirementSubtotal.value,
              quantity: requirementQuantity.value,
              currencyCode: currencyCode,
            }}
            usageLimits={{
              oncePerCustomer: appliesOncePerCustomer.value,
              totalUsageLimit: usageLimit.value,
            }}
          />
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
