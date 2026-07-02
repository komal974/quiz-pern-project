const express = require("express");
const router = express.Router();

const { createQuiz , getAllQuizzes, getQuizById, updateQuiz, deleteQuiz} = require("../controllers/quizController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Create Quiz (Admin Only)
router.post("/", authMiddleware, adminMiddleware, createQuiz);
router.get("/", authMiddleware, getAllQuizzes);
router.get("/:id", authMiddleware, getQuizById);
router.put("/:id", authMiddleware, adminMiddleware, updateQuiz);
router.delete("/:id", authMiddleware, adminMiddleware, deleteQuiz);
module.exports = router;