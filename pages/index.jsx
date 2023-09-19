import isShopAvailable from "@/utils/middleware/isShopAvailable";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { Layout, LegacyCard, Page } from "@shopify/polaris";
import { useRouter } from "next/router";

//On first install, check if the store is installed and redirect accordingly
export async function getServerSideProps(context) {
  return await isShopAvailable(context);
}

const HomePage = () => {
  const router = useRouter();
  const app = useAppBridge();
  const redirect = Redirect.create(app);

  return (
    <Page title="Home">
      <Layout>
        <Layout.Section fullWidth>
          <LegacyCard
            title="Iphis Discounts"
            sectioned
          >
            <p>
            This app offers an automatic discount of $60 when you purchase 5 items, and it also supports equivalent discounts in other currencies. 
            <br />
            <br />
            <b>Buy 5 for :</b>  
            <ul>
                <li>USD 60</li>
                <li>CAD 80</li>
                <li>GBP 48</li>
                <li>EUR 56</li>
                <li>AUD 93</li>
                <li>MXN 1027</li>
            </ul>

            <br />
            <br />

            <b>To enable this discount, follow these simple steps:</b>

            <ul>
                <li>Go to Discounts</li>
                <li>Create Discount</li>
                <li>Choose Iphis Order Discount 5 for $60</li>
            </ul>
            </p>
          </LegacyCard>
        </Layout.Section>

      </Layout>
    </Page>
  );
};

export default HomePage;
