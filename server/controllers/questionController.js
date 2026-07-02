const pool = require("../config/db");

// Create Question
const createQuestion = async (req, res) => {
    try {
        const { quiz_id, question, option1, option2, option3, option4, correct_answer } = req.body;

        // Validation
        if (
            !quiz_id ||
            !question ||
            !option1 ||
            !option2 ||
            !option3 ||
            !option4 ||
            !correct_answer
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if quiz exists
        const quiz = await pool.query(
            "SELECT id FROM quizzes WHERE id = $1",
            [quiz_id]
        );

        if (quiz.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        const result = await pool.query(
            `INSERT INTO questions
            (quiz_id, question, option1, option2, option3, option4, correct_answer)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *`,
            [
                quiz_id,
                question,
                option1,
                option2,
                option3,
                option4,
                correct_answer
            ]
        );

        res.status(201).json({
            success: true,
            message: "Question added successfully",
            question: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// Get Questions by Quiz ID
const getQuestionsByQuizId = async (req, res) => {
    try {
        const { quizId } = req.params;

        const result = await pool.query(
            `SELECT
                id,
                quiz_id,
                question,
                option1,
                option2,
                option3,
                option4
             FROM questions
             WHERE quiz_id = $1
             ORDER BY id`,
            [quizId]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            questions: result.rows
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
const updateQuestion = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            question,
            option1,
            option2,
            option3,
            option4,
            correct_answer
        } = req.body;

        const result = await pool.query(
            `UPDATE questions
             SET question=$1,
                 option1=$2,
                 option2=$3,
                 option3=$4,
                 option4=$5,
                 correct_answer=$6
             WHERE id=$7
             RETURNING *`,
            [
                question,
                option1,
                option2,
                option3,
                option4,
                correct_answer,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        res.json({
            success: true,
            message: "Question Updated",
            question: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
const deleteQuestion = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM questions WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        res.json({
            success: true,
            message: "Question Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};
module.exports = {
    createQuestion,
    getQuestionsByQuizId,
    updateQuestion,
    deleteQuestion
};