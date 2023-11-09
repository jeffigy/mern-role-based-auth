require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const { logEvents } = require("./middleware/logger");
const PORT = process.env.PORT || 5000;

console.log(process.env.NODE_ENV);
connectDB();

app.use(cookieParser());
app.use(logger);
app.use(express.json());
app.use(cors(corsOptions));

app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/", require("./routes/root"));
app.use("/users", require("./routes/user"));
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
});

mongoose.connection.on("error", (error) => {
  console.log(error);
  logEvents(
    `${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`,
    "mongoErrorlog.log"
  );
});
