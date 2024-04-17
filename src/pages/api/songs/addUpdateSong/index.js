import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { addUpdateSong } from "../../../../../backend/controllers/songsController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.post(addUpdateSong);

export default router.handler({ onError });
