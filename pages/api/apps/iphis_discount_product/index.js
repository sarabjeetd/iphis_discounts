import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";
import { json } from "@remix-run/node";
import db from "@/utils/prisma"

const handler = async (req, res) => {
  try {
    const { client } = await clientProvider.graphqlClient({
      req,
      res,
      isOnline: false,
    });
    const data = JSON.stringify(req.body.discount);
    const discount = JSON.parse(data);
    const {
      title,
      method,
      code,
      usageLimit,
      appliesOncePerCustomer,
      startsAt,
      combinesWith,
      endsAt,
      configuration: { quantity, amount }
    } = discount;
    const mutationEndsAt = endsAt ? `"${endsAt}"` : `"${startsAt}"`;
        const response = await client.query({
      data: `mutation MyMutation {
        discountAutomaticAppCreate(
          automaticAppDiscount: {
            functionId: "${process.env.SHOPIFY_IPHIS_PRODUCT_DISCOUNT_UNSTABLE_UNDER_TESTING_ID}", 
            title: "${title}", 
            startsAt:  "${startsAt}",
            endsAt: ${mutationEndsAt},
            combinesWith: {
              orderDiscounts:  ${combinesWith.orderDiscounts},
              productDiscounts: ${combinesWith.productDiscounts},
              shippingDiscounts:  ${combinesWith.shippingDiscounts},
            }     
          }
        ) {
          automaticAppDiscount {
            combinesWith {
              orderDiscounts
              productDiscounts
              shippingDiscounts
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
      }`,      
    });


    console.log("latest response: "+ JSON.stringify(response));

    
    const userErrors = response.body.data.discountAutomaticAppCreate.userErrors;
    if (userErrors && userErrors.length > 0) {
      return res.status(400).json({ errors: userErrors });
    } else {
      const jsonResponse = JSON.stringify(response);
      const data = JSON.parse(jsonResponse);
      const { title, endsAt, startsAt, createdAt, status, discountId, discountClass, combinesWith } = data.body.data.discountAutomaticAppCreate.automaticAppDiscount;
      const newData = await db.DiscountAutomaticApp.create({
          data: {
            title: title,
            startsAt: startsAt,
            endsAt: endsAt,
            orderDiscounts: combinesWith.orderDiscounts,
            productDiscounts: combinesWith.productDiscounts,
            shippingDiscounts: combinesWith.shippingDiscounts,
            createdAt: createdAt,
            status: status,
            discountId: discountId,
            discountClass: discountClass,
          }
        })
        
      return res.status(200).json({ data: newData,  message: "Success" });
    }

    } catch (e) {
    console.error(e);
    return res.status(400).send({ error: true });
  }
};

export default withMiddleware("verifyRequest")(handler);