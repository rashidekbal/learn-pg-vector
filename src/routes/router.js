import { Router } from "express";
import { addVideo, getVideo } from "../controllers/controller.js";
const router = Router();

router.post("/",addVideo);
router.get("/",getVideo)

export default router;
