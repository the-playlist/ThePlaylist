import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getAllStaff } from "../../../../../backend/controllers/dutyController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.get(getAllStaff);

export default router.handler({ onError });
