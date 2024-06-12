import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getLimitByTitle } from "../../../../../backend/controllers/limitController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.get(getLimitByTitle);

export default router.handler({ onError });
