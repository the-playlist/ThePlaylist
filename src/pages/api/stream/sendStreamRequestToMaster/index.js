import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { sendStreamRequestToMaster } from "../../../../../backend/controllers/streamController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.post(sendStreamRequestToMaster);

export default router.handler({ onError });
