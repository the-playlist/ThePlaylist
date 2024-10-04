import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { saveUserActions } from "../../../../../backend/controllers/actionsTrackingController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.post(saveUserActions);

export default router.handler({ onError });