import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getSongsForTableViewV2 } from "../../../../../backend/controllers/playlistController";
import onError from "../../../../../backend/middlewares/errors";
const router = createRouter();
connectMongoDb();
router.post(getSongsForTableViewV2);
export default router.handler({ onError });
