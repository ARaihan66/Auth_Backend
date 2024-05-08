const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./Database/connectionDB");
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//router
const userRouter = require("./Routers/userRouter");

app.use("/api/user", userRouter);

connectDB();

app.listen(port, () => {
  console.log(`The server is running on the port no. ${port}`);
});
