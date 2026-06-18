import express from "express";
import multer from "multer";
import {
  createComplaint,
  getAllComplaints,
  getUserComplaints,
  updateComplaintStatus,
  getComplaintStats,
} from "../controllers/complaintcontroller.js";

const router = express.Router();

/* MULTER SETUP FOR VERCEL */
const upload = multer({
  storage: multer.memoryStorage(),
});

/* ROUTES */
router.post("/", upload.single("image"), createComplaint);

router.get("/", getAllComplaints);
router.get("/user/:userId", getUserComplaints);
router.put("/:id", updateComplaintStatus);
router.get("/stats", getComplaintStats);

export default router;
