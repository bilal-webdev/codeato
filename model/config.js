const mongoose = require("mongoose");

exports.Connection = (URL) => {
  mongoose
    .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log(err));
};
