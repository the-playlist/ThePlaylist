import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { deletePlayerById } from "../../../../../backend/controllers/playersController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.delete(deletePlayerById);
export default router.handler({ onError });
