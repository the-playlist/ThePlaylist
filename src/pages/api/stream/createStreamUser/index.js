import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { createStreamUser } from "../../../../../backend/controllers/streamController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.post(createStreamUser);

export default router.handler({ onError });
