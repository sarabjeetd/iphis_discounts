import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";

const handler = async (req, res) => {
  try {
    const { client } = await clientProvider.graphqlClient({
      req,
      res,
      isOnline: false, //false for offline session, true for online session
    });

    const response = await client.query({
      data: `mutation MyMutation {
        discountAutomaticAppCreate(
          automaticAppDiscount: {
            functionId: "${process.env.SHOPIFY_IPHIS_PRODUCT_DISCOUNT_UNSTABLE_UNDER_TESTING_ID}", 
            title: "Iphis Product level discount", 
            startsAt: "2023-09-09T00:00:00",
            combinesWith: {
              productDiscounts: true
            }
          }
        ) {
          automaticAppDiscount {
            combinesWith {
              productDiscounts
            }
            title
            endsAt
            startsAt
            createdAt
            status
            discountId
            discountClass
          }
          userErrors {
            code
            extraInfo
            field
            message
          }
        }
      }
      `, //Paste your GraphQL query/mutation here
    });

    res.status(200).send(response);
  } catch (e) {
    console.error(e);
    return res.status(400).send({ error: true });
  }
};

export default withMiddleware("verifyRequest")(handler);