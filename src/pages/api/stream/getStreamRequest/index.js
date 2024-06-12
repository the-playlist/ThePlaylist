import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getStreamRequest } from "../../../../../backend/controllers/streamController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.get(getStreamRequest);

export default router.handler({ onError });
