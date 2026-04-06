const express = require("express");
const cors = require("cors");
require("dotenv").config();

const homeRoutes = require("./routes/homeRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/", homeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
