const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();
const path = require("path");

app.use(express.json());
app.use(cors());

app.use("/", express.static(path.join(__dirname, "/public")));
app.get("/", require("./routes/root"));
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

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
