
import Complaint from "../models/complaint.js";
import { sendEmail } from "../utils/sendEmail.js";

export const createComplaint = async (req, res) => {
  try {
    // 🔥 Check last complaint by same user
    const lastComplaint = await Complaint.findOne({
      userId: req.body.userId,
    }).sort({ createdAt: -1 });

    if (lastComplaint) {
      const diffHours =
        (Date.now() - new Date(lastComplaint.createdAt).getTime()) /
        (1000 * 60 * 60);

      if (diffHours < 24) {
        return res.status(400).json({
          message:
            "You can submit a new complaint only after 24 hours.",
        });
      }
    }

    const complaint = await Complaint.create(req.body);

    // 📧 ADMIN MAIL
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "📢 New Complaint Submitted",
      html: `
        <h2>New Complaint Received</h2>

        <p><b>Name:</b> ${complaint.fullName}</p>
        <p><b>Email:</b> ${complaint.email}</p>
        <p><b>Phone:</b> ${complaint.phoneNumber}</p>

        <p><b>Issue Type:</b> ${complaint.issueType}</p>
        <p><b>Description:</b> ${complaint.problemDescription}</p>

        <p><b>Status:</b> ${complaint.status}</p>
      `,
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// import Complaint from "../models/complaint.js";
// import { sendEmail } from "../utils/sendEmail.js";

export const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const oldComplaint = await Complaint.findById(req.params.id);

    if (!oldComplaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }
    if (oldComplaint.status === status) {
      return res.json({
        success: true,
        message: "Status already set",
      });
    }

    oldComplaint.status = status;
    await oldComplaint.save();

    await sendEmail({
      to: oldComplaint.email,
      subject: `🔄 Complaint Status Updated - ${status}`,
      html: `
        <h2>Hello ${oldComplaint.fullName},</h2>

        <p>Your complaint status has been updated.</p>

        <p><b>Issue:</b> ${oldComplaint.issueType}</p>
        <p><b>Status:</b> ${status}</p>

        ${
          status === "Pending"
            ? "<p>⏳ Your complaint is waiting for review.</p>"
            : status === "In Progress"
            ? "<p>🔧 Your complaint is currently being worked on.</p>"
            : "<p>✅ Your complaint has been resolved successfully.</p>"
        }

        <br/>
        <p>Thank you,<br/><b>CampusFix Team</b></p>
      `,
    });

    res.json({
      success: true,
      message: "Status updated and email sent",
      complaint: oldComplaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



/* =========================
   GET ALL COMPLAINTS (ADMIN)
   ========================= */
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET USER COMPLAINTS
   ========================= */
export const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   COMPLAINT STATS (ADMIN)
   ========================= */
export const getComplaintStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: "Pending" });
    const resolved = await Complaint.countDocuments({ status: "Fixed" });

    res.json({ total, pending, resolved });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
