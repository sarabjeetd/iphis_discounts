import useFetch from "@/components/hooks/useFetch";
import { Page, Layout, LegacyCard } from "@shopify/polaris";

const IphisProductDiscountPage = () => {
    const fetch = useFetch();
    return (
        <>
            <Page>
                <Layout>
                    <Layout.Section>
                        <LegacyCard sectioned title="Iphis Product Discount"  primaryFooterAction={{
                                   content: "Install",  
                                   onAction:async()=> {
                                    const response = await (await fetch("/api/apps/iphis_discount_product")).json();
                                    console.log(response);
                                   } 
                                }}
                            >
                            <p></p>
                        </LegacyCard>
                    </Layout.Section>
                </Layout>
            </Page>
        </>
    );
};

export default IphisProductDiscountPage;