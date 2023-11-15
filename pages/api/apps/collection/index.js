import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware.js";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { client } = await clientProvider.graphqlClient({
        req,
        res,
        isOnline: true,
      });
      const activeCollections = await client.query({
        data: `{
          collections(first: 20) {
            edges {
              node {
                id
                title
                handle
                updatedAt
                productsCount
                sortOrder
              }
            }
          }
          }`,
      });
      return res.status(200).send(activeCollections);
    } catch (e) {
      console.error(`---> An error occured`, e);
      return res.status(400).send({ text: "Bad request" });
    }
  } else {
    res.status(400).send({ text: "Bad request" });
  }
};

export default withMiddleware("verifyRequest")(handler);
