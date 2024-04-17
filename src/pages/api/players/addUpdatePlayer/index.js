import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { addUpdatePlayer } from "../../../../../backend/controllers/playersController";

const router = createRouter();
connectMongoDb();
router.post(addUpdatePlayer);

export default router.handler();
