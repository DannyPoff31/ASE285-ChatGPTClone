

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use(express.json());