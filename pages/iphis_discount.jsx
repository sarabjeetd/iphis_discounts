import useFetch from "@/components/hooks/useFetch";
import { Page, Layout, LegacyCard } from "@shopify/polaris";

const IphisDiscountPage = () => {
    const fetch = useFetch();
    return (
        <>
            <Page>
                <Layout>
                    <Layout.Section>
                        <LegacyCard sectioned title="Iphis Discount"  primaryFooterAction={{
                                    content: "Run",  
                                   onAction:async()=> {
                                    const response = await (await fetch("/api/apps")).json();
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

export default IphisDiscountPage;