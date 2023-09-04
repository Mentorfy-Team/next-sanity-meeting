import { openApiDocument } from "@/server/OpenAPI.document";
import { type NextApiRequest, type NextApiResponse } from "next";

// Respond with our OpenAPI schema
const hander = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send(openApiDocument);
};

export default hander;
