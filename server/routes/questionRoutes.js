const express = require("express");
const router = express.Router();

const { createQuestion , getQuestionsByQuizId, updateQuestion, deleteQuestion} = require("../controllers/questionController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Admin only
router.post("/", authMiddleware, adminMiddleware, createQuestion);
router.get("/quiz/:quizId", authMiddleware, getQuestionsByQuizId);
router.put("/:id", authMiddleware, adminMiddleware, updateQuestion);
router.delete("/:id", authMiddleware, adminMiddleware, deleteQuestion);
module.exports = router;