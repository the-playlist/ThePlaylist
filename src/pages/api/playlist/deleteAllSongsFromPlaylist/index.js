import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import {
  deleteAllSongsFromPlaylist,
  undoDeleteSongsFromPlaylist,
} from "../../../../../backend/controllers/playlistController";
import onError from "../../../../../backend/middlewares/errors";
const router = createRouter();
connectMongoDb();

router.delete(deleteAllSongsFromPlaylist);
router.post(undoDeleteSongsFromPlaylist);
export default router.handler({ onError });
