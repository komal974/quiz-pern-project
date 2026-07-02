const pool = require("../config/db");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await pool.query(
      `INSERT INTO users(name,email,password)
       VALUES($1,$2,$3)
       RETURNING id,name,email`,
      [name, email, hashedPassword]
    );

    res.status(201).json({
      user: user.rows[0],
      token: generateToken(user.rows[0].id)
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const result = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );

    const user = result.rows[0];

    if (!user) {
        return res.status(400).json({
            message: "User not found"
        });
    }

    const token = generateToken(user.id, user.role);

    res.json({
        token,
        user
    });
  }
exports.getProfile = async (req, res) => {
    try {

        const userId = req.user.id;

        const result = await pool.query(
            "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: result.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

