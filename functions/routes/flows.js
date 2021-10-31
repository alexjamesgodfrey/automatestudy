/**
 * MAIN ROUTES
 */
 const pool = require("../db.js");

 module.exports = function (app) {

    //digital flows
    app.get("/api/flows/:apporcloud/:cloud/:tasks", async (req, res) => {
        try {
            const { apporcloud, cloud, tasks } = req.params;
            const query = await pool.query("SELECT * FROM flowlist WHERE $1 = any (tags) AND $2 = any (tags) AND $3 = any (tags) ORDER BY flowlist.difficulty != 'Average', flowlist.difficulty != 'Hard', id asc ", 
            [apporcloud, cloud, tasks]);
            res.json(query.rows);
        } catch (err) {
            console.error(err.message);
        }
    })

    //get a flow by id
    app.get("/api/flows/:id/", async (req, res) => {
        try {
            const { id } = req.params;
            const query = await pool.query("SELECT * FROM flowlist WHERE id = $1", 
            [id]);
            res.json(query.rows[0]);
        } catch (err) {
            console.error(err.message);
        }
    })
}