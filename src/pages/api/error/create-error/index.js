import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { createError } from "../../../../../backend/controllers/errorController";
import onError from "../../../../../backend/utils/errorHandler";

const router = createRouter();
connectMongoDb();
router.post(createError);

export default router.handler({ onError });
