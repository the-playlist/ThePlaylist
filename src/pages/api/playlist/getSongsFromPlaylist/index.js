import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getSongsFromPlaylist } from "../../../../../backend/controllers/playlistController";
import onError from "../../../../../backend/middlewares/errors";
const router = createRouter();
connectMongoDb();
router.get(getSongsFromPlaylist);
export default router.handler({ onError });
