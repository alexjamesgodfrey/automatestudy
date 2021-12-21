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
    //get all flows
    app.get("/api/flows", async (req, res) => {
        try {
            const query = await pool.query("SELECT * FROM flows");
            res.json(query.rows);
        } catch (err) {
            console.error(err.message);
        }
    })

    //get flows by user
    app.get("/api/flows/user/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            const query = await pool.query("SELECT * FROM flows WHERE userid = $1", 
            [parseInt(uid)]);
            res.json(query.rows);
        } catch (err) {
            console.error(err.message);
        }
    })

    //create a flow for user
    app.post("/api/flows/create/:userid", async (req, res) => {
        try {
            const { userid } = req.params;
            const { active, c } = req.body;
            const query = await pool.query("INSERT INTO flows (userid, active, class) VALUES ($1, $2, $3)", 
                [userid, active, c]);
            logger.trace(`Successfully created flow for class ${c} for userid ${userid}`)
            res.json(`Successfully created flow for class ${c} for userid ${userid}`);
        } catch (err) {
            console.error(err.message);
        }
    })
     
     //activate a flow
     app.put("/api/flows/activate/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const query = await pool.query("UPDATE flows SET active = true WHERE id = $1", 
            [parseInt(id)]);
            res.json(query.rows);
        } catch (err) {
            console.error(err.message);
        }
     })

     //deactivate a flow
     app.put("/api/flows/deactivate/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const query = await pool.query("UPDATE flows SET active = false WHERE id = $1", 
            [parseInt(id)]);
            res.json(query.rows);
        } catch (err) {
            console.error(err.message);
        }
    })
}