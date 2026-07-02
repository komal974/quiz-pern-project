const pool = require("../config/db");

const submitQuiz = async (req, res) => {
    try {
        const userId = req.user.id;
        const { quiz_id, answers } = req.body;

        if (!quiz_id || !answers || answers.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Quiz answers are required."
            });
        }

        let score = 0;

        const questionIds = answers.map(a => a.question_id);

        const questionResult = await pool.query(
            "SELECT id, correct_answer FROM questions WHERE id = ANY($1)",
            [questionIds]
        );

        const correctMap = {};

        questionResult.rows.forEach(q => {
            correctMap[q.id] = q.correct_answer;
        });

        answers.forEach(answer => {
            if (correctMap[answer.question_id] == answer.selected_answer) {
                score++;
            }
        });

        const totalQuestions = answers.length;

        const attempt = await pool.query(
            `INSERT INTO attempts(user_id, quiz_id, score, total_questions)
             VALUES($1,$2,$3,$4)
             RETURNING *`,
            [userId, quiz_id, score, totalQuestions]
        );

        const attemptId = attempt.rows[0].id;

        for (const answer of answers) {

            const isCorrect =
                correctMap[answer.question_id] == answer.selected_answer;

            await pool.query(
                `INSERT INTO answers
                (attempt_id, question_id, selected_answer, is_correct)
                VALUES($1,$2,$3,$4)`,
                [
                    attemptId,
                    answer.question_id,
                    answer.selected_answer,
                    isCorrect
                ]
            );
        }

        res.status(201).json({
            success: true,
            score,
            totalQuestions,
            attemptId
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
const getMyResults = async (req, res) => {
    try {

        const userId = req.user.id;

        const result = await pool.query(
            `SELECT
                a.id,
                q.title,
                a.score,
                a.total_questions,
                a.submitted_at
             FROM attempts a
             JOIN quizzes q ON a.quiz_id = q.id
             WHERE a.user_id = $1
             ORDER BY a.submitted_at DESC`,
            [userId]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            results: result.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

const getResultById = async (req, res) => {
    try {

        const userId = req.user.id;
        const { attemptId } = req.params;

        // Check ownership
        const attempt = await pool.query(
            "SELECT * FROM attempts WHERE id=$1 AND user_id=$2",
            [attemptId, userId]
        );

        if (attempt.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Result not found"
            });
        }

        const result = await pool.query(
            `SELECT
                q.question,
                q.option1,
                q.option2,
                q.option3,
                q.option4,
                q.correct_answer,
                a.selected_answer,
                a.is_correct
             FROM answers a
             JOIN questions q
             ON a.question_id = q.id
             WHERE a.attempt_id = $1`,
            [attemptId]
        );

        res.status(200).json({
            success: true,
            attempt: attempt.rows[0],
            answers: result.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};

module.exports = {
    submitQuiz,
    getMyResults,
    getResultById
};