import { useEffect, useMemo, useState } from "react";
import isShopAvailable from "@/utils/middleware/isShopAvailable";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import {PrismaClient} from "@prisma/client";
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
               const fieldName = field.join(' > ');
              return (
                <li key={`${message}${index}`}>
                  <strong>{fieldName}:</strong> {message}X
                </li>
              );
            })}
          </ul>
        </Banner>
      </Layout.Section>
    );
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
          <Form method="post" >
            {/* <MethodCard
              title="IPHIS"
              discountTitle={discountTitle}
              discountClass={DiscountClass.Product}
              discountCode={discountCode}
              discountMethod={discountMethod}
            /> */}
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
                {/* <TextField
                          label="Discount"
                          autoComplete="on"
                          {...configuration.amount}
                          suffix="$"
                        /> */}
              </Card>
              <Card>
                <Select
                  label="Currency Code"
                  options={[
                    { label: "CAD", value: CurrencyCode.Cad },
                    { label: "USD", value: CurrencyCode.Usd },
                    { label: "GBP", value: CurrencyCode.Gbp },
                    { label: "EUR", value: CurrencyCode.Eur },
                    { label: "AUD", value: CurrencyCode.Aud },
                    { label: "Mxn", value: CurrencyCode.Mxn },
                  ]}
                  value={selectedCurrencyCode}
                  onChange={handleCurrencyCodeChange}
                />

                <CurrencyField
                  currencyCode={selectedCurrencyCode}
                  label="Offer Amount"
                  onChange={setCurrencyCodeValue}
                  value={CurrencyCodeValue}
                />
                <span className="Polaris-Text--root Polaris-Text--subdued">
                  Price of items
                </span>
              </Card>
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
