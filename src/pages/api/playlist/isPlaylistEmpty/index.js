import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { isPlaylistEmpty } from "../../../../../backend/controllers/playlistController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.get(isPlaylistEmpty);
export default router.handler({ onError });
