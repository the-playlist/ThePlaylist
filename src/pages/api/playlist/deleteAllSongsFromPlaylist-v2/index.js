import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { deleteAllSongsFromPlaylistV2 } from "../../../../../backend/controllers/playlistController";
import onError from "../../../../../backend/middlewares/errors";
const router = createRouter();
connectMongoDb();

router.delete(deleteAllSongsFromPlaylistV2);
export default router.handler({ onError });
