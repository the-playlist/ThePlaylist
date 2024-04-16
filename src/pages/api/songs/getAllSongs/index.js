import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getAllSongs } from "../../../../../backend/controllers/songsController";
const router = createRouter();
connectMongoDb();
router.get(getAllSongs);

export default router.handler();
