import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { updateTypeToPlaylist } from "../../../../../backend/controllers/playlistTypeController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.post(updateTypeToPlaylist);

export default router.handler({ onError });
