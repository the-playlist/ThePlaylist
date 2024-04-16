import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getSongByOnDutyPlayer } from "../../../../../backend/controllers/songsController";
const router = createRouter();
connectMongoDb();
router.get(getSongByOnDutyPlayer);
export default router.handler();
