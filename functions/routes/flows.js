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
    app.get("/api/flows/user/:userid", async (req, res) => {
        try {
            const { userid } = req.params;
            const query = await pool.query("SELECT * FROM flows WHERE userid = $1", 
            [parseInt(userid)]);
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
            const { userid } = req.params;
            console.log(err.message)
            logger.error(`Could not create flow for userid ${userid}. \n ${err.message}`)
        }
    })
     
     //activate a flow
    app.put("/api/flows/activate/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const query = await pool.query("UPDATE flows SET active = true WHERE id = $1", 
                [parseInt(id)]);
            logger.trace(`Successfully activated flow for class ${c} for userid ${userid}`)
            res.json(`Successfully activated flow for class ${c} for userid ${userid}`);
        } catch (err) {
            const { userid } = req.params;
            logger.error(`Could not activate flow for userid ${userid}. \n ${err.message}`)
        }
    })

    //deactivate a flow
    app.put("/api/flows/deactivate/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const query = await pool.query("UPDATE flows SET active = false WHERE id = $1", 
                [parseInt(id)]);
            logger.trace(`Successfully deactivated flow for class ${c} for userid ${userid}`)
            res.json(`Successfully deactivated flow for class ${c} for userid ${userid}`);
        } catch (err) {
            const { userid } = req.params;
            logger.error(`Could not deactivate flow for userid ${userid}. \n ${err.message}`)
        }
    })
     
    //update the path for a flow
    app.put("/api/flows/path/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { path } = req.body;
            const query = await pool.query("UPDATE flows SET path = $1 WHERE id = $2", 
                [parseInt(id)]);
            logger.trace(`Successfully set path to ${path} for flow ${id}`)
            res.json(`Successfully set path to ${path} for flow ${id}`);
        } catch (err) {
            const { id } = req.params;
            logger.error(`Could not set path for flow ${id}. \n ${err.message}`)
        }
    })
}