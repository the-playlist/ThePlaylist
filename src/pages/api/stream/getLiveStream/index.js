import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getLiveStream } from "../../../../../backend/controllers/streamController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.get(getLiveStream);

export default router.handler({ onError });
