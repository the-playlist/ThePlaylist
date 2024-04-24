import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import onError from "../../../../../backend/middlewares/errors";
import { RegisterUser } from "../../../../../backend/controllers/user";

const router = createRouter();
connectMongoDb();
router.post(RegisterUser);

export default router.handler({ onError });
