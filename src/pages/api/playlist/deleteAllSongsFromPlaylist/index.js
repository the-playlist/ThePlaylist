import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { deleteAllSongsFromPlaylist } from "../../../../../backend/controllers/playlistController";
import onError from "../../../../../backend/middlewares/errors";
const router = createRouter();
connectMongoDb();

router.delete(deleteAllSongsFromPlaylist);
export default router.handler({ onError });
