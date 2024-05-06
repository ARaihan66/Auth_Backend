const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./Database/connectionDB");
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello Server is Running....");
});



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
connectDB();

app.listen(port, () => {
  console.log(`The server is running on the port no. ${port}`);
});
