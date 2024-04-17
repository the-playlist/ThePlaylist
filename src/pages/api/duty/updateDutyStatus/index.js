import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { updateDutyStatus } from "../../../../../backend/controllers/dutyController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.post(updateDutyStatus);

export default router.handler({ onError });
