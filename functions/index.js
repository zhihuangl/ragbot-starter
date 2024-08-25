const functions = require("firebase-functions");

exports.chat = functions.https.onRequest((req, res) => {
  res.send("Function is working!");
});
