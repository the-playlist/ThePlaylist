import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getLocationList } from "../../../../../backend/controllers/locationController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.get(getLocationList);

export default router.handler({ onError });
