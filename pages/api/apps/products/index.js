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
      const activeProducts = await client.query({
        data: `{
          products(first: 10, reverse: true) {
            edges {
              node {
                id
                title
                handle
                resourcePublicationOnCurrentPublication {
                  publication {
                    name
                    id
                  }
                  publishDate
                  isPublished
                }
              }
            }
          }
          }`,
      });
      return res.status(200).send(activeProducts);
    } catch (e) {
      console.error(`---> An error occured`, e);
      return res.status(400).send({ text: "Bad request" });
    }
  } else {
    res.status(400).send({ text: "Bad request" });
  }
};

export default withMiddleware("verifyRequest")(handler);
