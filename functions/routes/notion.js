/**
 * MAIN ROUTES
 */
 const pool = require("../db.js");

 module.exports = function (app) {

    app.get('/api/notioninformation', async (req, res) => {
        try {
            const getAll = await pool.query(
                "SELECT * FROM notioninformation"
            )
            res.json(getAll.rows)
        } catch (err) {
            console.error(err.message)
        }
    })

    app.put('/api/notioninformation/database/:userid', async (req, res) => {
        try {
            const { userid } = req.params
            const { id, url } = req.body
            const getAll = await pool.query(
                "UPDATE notioninformation SET database_id=$1, database_url=$2 WHERE userid=$3", 
                [id, url, parseInt(userid)])
            res.json(getAll.rows)
        } catch (err) {
            console.error(err.message)
        }
    })

    /**
     * Creates a new notioninformation entry 
     * @param {String} userid 
     */
    app.post("/api/notioninformation/initial/:userid", async (req, res) => {
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