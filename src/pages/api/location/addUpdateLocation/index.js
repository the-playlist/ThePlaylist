import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { addUpdateLocation } from "../../../../../backend/controllers/locationController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.post(addUpdateLocation);

export default router.handler({ onError });
