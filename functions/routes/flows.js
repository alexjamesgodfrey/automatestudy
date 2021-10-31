/**
 * MAIN ROUTES
 */
 const pool = require("../db.js");

 module.exports = function (app) {

    //get all users
    app.get("/api/users", async (req, res) => {
        try {
            const req = await pool.query("SELECT * FROM users");
            res.json(req.rows);
        } catch (err) {
            console.error(err.message);
        }
    })
}