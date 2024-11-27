import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { requestToPerformSong } from "../../../../../backend/controllers/playlistController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.post(requestToPerformSong);

export default router.handler({ onError });
