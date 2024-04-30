import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getSongsForTableView } from "../../../../../backend/controllers/playlistController";
import onError from "../../../../../backend/middlewares/errors";
const router = createRouter();
connectMongoDb();
router.get(getSongsForTableView);
export default router.handler({ onError });
