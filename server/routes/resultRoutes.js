const express = require("express");
const router = express.Router();

const { submitQuiz, getMyResults, getResultById} = require("../controllers/resultController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/submit", authMiddleware, submitQuiz);





router.get("/", authMiddleware, getMyResults);

router.get("/:attemptId", authMiddleware, getResultById);

module.exports = router;