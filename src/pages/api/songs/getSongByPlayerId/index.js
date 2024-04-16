import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getSongByPlayerId } from "../../../../../backend/controllers/songsController";

const router = createRouter();
connectMongoDb();
router.get(getSongByPlayerId);

export default router.handler();
