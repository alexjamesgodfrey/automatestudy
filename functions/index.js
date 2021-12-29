require("dotenv").config();
const functions = require("firebase-functions");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

//initiate app
app.use(cors());
app.use('/api/stripewebhook', express.raw({type: "*/*"}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client", "build")));

//routes
require('./routes/users.js')(app);
require('./routes/surveyresponses.js')(app);
require('./routes/flows.js')(app);
require('./routes/notion.js')(app);
require('./routes/onedrive.js')(app);
require('./routes/todoist.js')(app);
require('./routes/history.js')(app);
require('./routes/stripe.js')(app);

//serve client
app.get("/", async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
    } catch (err) {
        console.error(err.message);
    }
})


if (process.env.DEVELOPMENT === 'true') {
    app.listen(process.env.DEVELOPMENT_PORT, () => {
        console.log(`server has started on port ${process.env.DEVELOPMENT_PORT}`);
        console.log('static file served at ' + path.join(__dirname, "..", "client", "build", "index.html"));
    });
}

//refreshes OneDrive access tokens every 55 minutes


exports.automatestudy = functions.https.onRequest(app)