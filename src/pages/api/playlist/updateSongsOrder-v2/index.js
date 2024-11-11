import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { updateSongsOrderV2 } from "../../../../../backend/controllers/playlistController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.post(updateSongsOrderV2);
export default router.handler({ onError });
