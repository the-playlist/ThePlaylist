import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { disableSongById } from "../../../../../backend/controllers/songsController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.post(disableSongById);

export default router.handler({ onError });
