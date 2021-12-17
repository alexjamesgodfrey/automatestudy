/**
 * RESPONSES ROUTES
 */
 const pool = require("../db.js");

 module.exports = function (app) {

    //get all surveyresponses
    app.get("/api/surveyresponses", async (req, res) => {
        try {
            const req = await pool.query("SELECT * FROM surveyresponses");
            res.json(req.rows);
        } catch (err) {
            console.error(err.message);
        }
    })

    //check if a user has a surveyresponse
    app.get("/api/surveyresponses/:uid", async (req, res) => {
        try {
            const { uid } = req.params;
            const user = await pool.query("SELECT * FROM surveyresponses WHERE uid = $1", [uid]);
            res.json(user.rows);
        } catch (err) {
            console.error(err.message);
        }
    })

    //create a new surveyresponse
    app.post("/api/surveyresponses", async (req, res) => {
        try {
            let counter = 0
            const email = req.body.form_response.hidden.email
            const uid = req.body.form_response.hidden.uid
            const studylocation = req.body.form_response.answers[counter].choice.label
            let college = null
            let cornellcollege = null
            counter += 1 //counter is now 1
            if (studylocation === 'College/University') {
                college = req.body.form_response.answers[counter].choice.label
                counter += 1 //counter is now 2
                if (college === 'Cornell University') {
                  cornellcollege = req.body.form_response.answers[counter].choice.label
                  counter += 1 //counter is now 3
                }
              }
            const grade = req.body.form_response.answers[counter].choice.label
            counter += 1 //counter is now either 2 or 4
            const media = req.body.form_response.answers[counter].choice.label
            counter += 1 //counter is now either 3 or 5
            const apporcloud = req.body.form_response.answers[counter].choice.label
            counter += 1 //counter is now either 4 or 6 
            let cloud = null
            if (media === 'Digital Writing (iPad, Surface)'){
                cloud = req.body.form_response.answers[counter].choice.label
                counter += 1 //counter is now either 5 or 7
            }
            const numberofclasses = req.body.form_response.answers[counter].number
            counter += 1 
            let classesarray = []
            for (let i=0; i<numberofclasses; i++) {
                classesarray.push(req.body.form_response.answers[counter].text)
                counter += 1
            }
            const insertUser = await pool.query(
                "INSERT INTO surveyresponses (email, uid, studylocation, college, cornellcollege, grade, media, apporcloud, cloud, numberofclasses, classesarray) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", 
                [email, uid, studylocation, college, cornellcollege,
                    grade, media, apporcloud, cloud, numberofclasses, 
                    classesarray]);
            res.json(insertUser.rows);
        } catch (err) {
            console.error(err.message);
        }
    })
}