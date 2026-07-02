const app = require("./app");
require("dotenv").config();

const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const resultRoutes = require("./routes/resultRoutes");


const PORT =  5000;

app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});