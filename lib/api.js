const express = require("express");
const app = express();
const apiRouter = express.Router();

app.use(express.json());

module.exports = function (database) {
    apiRouter.post("/set", (req, res) => {
        const { key, val, name } = req.body;
        if (!key || !val || !name) return res.status(412).send("Missing key, val, or name value.");
        return database.set(key, val, name);
    });
    
    apiRouter.get("/get", async (req, res) => {
        const { key, name } = req.query;
        if (!key || !name) return res.status(412).send("Missing key or name value.");
        try {
            const data = await database.get(key, name);
            if (!data) return res.status(404).send(null);
            return res.send(data);
        } catch (error) {
            return res.status(500).send("Server error.");
        }
    });


    apiRouter.get("/keys", async (req, res) => {
        const { name } = req.query;
        if (!name) return res.status(412).send("Missing name value.");
        try {
            const data = await database.keys(name);
            if (!data) return res.status(404).send(null);
            return res.send(data);
        } catch (error) {
            return res.status(500).send("Server error.");
        }
    });
    app.use("/api", apiRouter);
    app.listen(3963, "api");
}