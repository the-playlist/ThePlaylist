import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getAllPlayers } from "../../../../../backend/controllers/playersController";
const router = createRouter();
connectMongoDb();
router.get(getAllPlayers);
export default router.handler();
