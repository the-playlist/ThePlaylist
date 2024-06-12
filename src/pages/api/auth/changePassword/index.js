import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import onError from "../../../../../backend/middlewares/errors";
import { ChangePassword } from "../../../../../backend/controllers/user";

const router = createRouter();
connectMongoDb();
router.post(ChangePassword);

export default router.handler({ onError });
