/**
 * MAIN ROUTES
 */
 const pool = require("../db.js");

 module.exports = function (app) {

    //get user based on uid
    app.get("/api/users/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            const here = await pool.query("SELECT * FROM automateusers WHERE uid = $1", [uid]);
            res.json(here.rows);
        } catch (err) {
            console.error(err.message);
        }
    })

    //get a user's survey response based on uid
    app.get("/api/survey/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            const here = await pool.query("SELECT * FROM automateresponses WHERE uid = $1", [uid]);
            res.json(here.rows);
        } catch (err) {
            console.error(err.message);
        }
    })
}