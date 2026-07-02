const pool = require("../config/db");

// Create Quiz
const createQuiz = async (req, res) => {
    try {
        const { title, description, duration } = req.body;

        // Validation
        if (!title || !duration) {
            return res.status(400).json({
                success: false,
                message: "Title and Duration are required."
            });
        }

        const result = await pool.query(
            `INSERT INTO quizzes(title, description, duration, created_by)
             VALUES($1, $2, $3, $4)
             RETURNING *`,
            [title, description, duration, req.user.id]
        );

        res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            quiz: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
const updateQuiz = async (req, res) => {

    try {

        const { id } = req.params;
        const { title, description, duration } = req.body;

        const result = await pool.query(
            `UPDATE quizzes
             SET title=$1,
                 description=$2,
                 duration=$3
             WHERE id=$4
             RETURNING *`,
            [title, description, duration, id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });

        }

        res.json({
            success: true,
            message: "Quiz Updated",
            quiz: result.rows[0]
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};
const deleteQuiz = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM quizzes WHERE id=$1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });

        }

        res.json({
            success: true,
            message: "Quiz Deleted Successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

// Get All Quizzes
const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await pool.query(
            "SELECT * FROM quizzes ORDER BY id DESC"
        );

        res.json({
            success: true,
            quizzes: quizzes.rows,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
const getQuizById = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM quizzes WHERE id=$1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        res.status(200).json({
            success: true,
            quiz: result.rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
module.exports = {
    createQuiz,
     getAllQuizzes,
     getQuizById,
     updateQuiz,
     deleteQuiz,
};