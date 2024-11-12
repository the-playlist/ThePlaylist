import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { addUpdateAlgorithmStatus } from "../../../../../backend/controllers/algorithStatusController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.post(addUpdateAlgorithmStatus);

export default router.handler({ onError });
