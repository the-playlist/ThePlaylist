import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { addUpdateSong } from "../../../../../backend/controllers/songsController";
const router = createRouter();
connectMongoDb();
router.post(addUpdateSong);
export default router.handler();
