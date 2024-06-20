import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getAllFavSongs } from "../../../../../backend/controllers/songsController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.get(getAllFavSongs);

export default router.handler({
  onError,
});
