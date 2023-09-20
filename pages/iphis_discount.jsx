import React, { useState } from 'react';
import useFetch from "@/components/hooks/useFetch";
import { Page, Layout, LegacyCard } from "@shopify/polaris";

const IphisDiscountPage = () => {
    const fetch = useFetch();
    const [content, setContent] = useState('');
    return (
        <>
            <Page>
                <Layout>
                    <Layout.Section>
                        <LegacyCard sectioned title="Iphis Order Discount"  primaryFooterAction={{
                                    content: "Install",  
                                   onAction:async()=> {
                                    const response = await (await fetch("/api/apps")).json();
                                    console.log(response);
                                    if(response.body.data.discountAutomaticAppCreate.userErrors.length > 0){
                                        setContent("Error: Please contact the app developer");
                                    }
                                    else{
                                        setContent("Success: Discount is now installed. Please go to Discounts to see new discount");
                                    }
                                   } 
                                }}
                            >
                            <p>{content}</p>
                        </LegacyCard>
                    </Layout.Section>
                </Layout>
            </Page>
        </>
    );
};

export default IphisDiscountPage;