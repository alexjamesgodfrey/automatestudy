/**
 * MAIN ROUTES
 */
 const pool = require("../db.js");

 module.exports = function (app) {

    //notability, onedrive, studytasks
    app.get("/api/flows/notability/onedrive/studytasks", async (req, res) => {
        try {
            const req = await pool.query("SELECT * FROM flowlist WHERE 'Notability' = any (tags) AND 'OneDrive' = any (tags) AND 'StudyTasks' = any (tags) ORDER BY flowlist.difficulty != 'Average', flowlist.difficulty != 'Hard', id asc ");
            res.json(req.rows);
        } catch (err) {
            console.error(err.message);
        }
    })
}