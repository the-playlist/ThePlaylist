import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { changeStreamStatus } from "../../../../../backend/controllers/streamController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.post(changeStreamStatus);

export default router.handler({ onError });
