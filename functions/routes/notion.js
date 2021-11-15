/**
 * MAIN ROUTES
 */
 const pool = require("../db.js");

 module.exports = function (app) {

    /**
     * Creates a new notioninformation entry 
     * @param {String} userid 
     */
    app.post("/api/notioninformation/:userid", async (req, res) => {
        try {
            const { userid } = req.params;
            const { access_token, workspace_id, workspace_name, workspace_icon, bot_id, owner } = req.body;
            const insertNotion = await pool.query(
                "INSERT INTO notioninformation (userid, access_token, workspace_id, workspace_name, workspace_icon, bot_id, owner) VALUES ($1, $2, $3, $4, $5, $6, $7)", 
                [parseInt(userid), access_token, workspace_id, workspace_name, workspace_icon, bot_id, owner]);
            res.json(insertNotion.rows);
        } catch (err) {
            console.error(err.message);
        }
    })
}