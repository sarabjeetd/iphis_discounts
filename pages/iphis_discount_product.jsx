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
                                   content: "Installl",  
                                   onAction:async()=> {
                                    const response = await (await fetch("/api/apps/collection")).json();
                                    console.log("collecion_list" + JSON.stringify(response));
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