import { Router } from "express";
import { register, login, logout, me } from "../controllers/authController.js";
import { updateProfilePic } from "../controllers/uploadController.js";
import { protect } from "../middlewares/protect.js";
import { uploadProfilePic } from "../middlewares/upload.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, me);
router.post("/profile/picture", protect, uploadProfilePic, updateProfilePic);

export default router;
