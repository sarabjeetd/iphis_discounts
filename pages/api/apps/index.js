import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";

const handler = async (req, res) => {
  try {
    const { client } = await clientProvider.graphqlClient({
      req,
      res,
      isOnline: false, //false for offline session, true for online session
    });

    const uniqueNumber = Date.now();

    const response = await client.query({
      data: `mutation MyMutation {
        discountAutomaticAppCreate(
          automaticAppDiscount: {
            title: "Iphis Custom Discount v${uniqueNumber}", 
            functionId: "${process.env.SHOPIFY_IPHIS_ORDER_DISCOUNTS_5_FOR_60_ID}",
            startsAt: "2023-09-15T00:00:00"
          }
        ) {
          automaticAppDiscount {
            discountId
          }
          userErrors {
            code
            extraInfo
            field
            message
          }
        }
      }
      `, 
    });

    res.status(200).send(response);
  } catch (e) {
    console.error(e);
    return res.status(400).send({ error: true });
  }
};

export default withMiddleware("verifyRequest")(handler);