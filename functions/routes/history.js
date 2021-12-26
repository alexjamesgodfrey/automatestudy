/**
 * MAIN ROUTES
 */
const pool = require("../db.js");
 
const log4js = require("log4js");
log4js.configure({
    appenders: {
      everything: { type: 'file', filename: 'log.log' }
    },
    categories: {
      default: { appenders: [ 'everything' ], level: 'trace' }
    }
});
var logger = log4js.getLogger();

module.exports = function (app) {
    //get all history
    app.get("/api/history", async (req, res) => {
        try {
            const request = await pool.query("SELECT * FROM history");
            res.json(request.rows);
        } catch (err) {
            console.error(err.message);
        }
    })

    //create history
    app.post("/api/history", async (req, res) => {
        try {
            const { type, message, userid } = req.body;
            const request = await pool.query("INSERT INTO history (type, message, userid) VALUES ($1, $2, $3)",
                [type, message, userid]);
            res.json(request.rows);
        } catch (err) {
            console.error(err.message);
        }
    })

    //get the utc of last flow run
    //get all history
    app.get("/api/history/allflow", async (req, res) => {
        try {
            const request = await pool.query("SELECT message FROM history WHERE type = 'allflow' ORDER BY message::bigint DESC");
            res.json(request.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
    })
}