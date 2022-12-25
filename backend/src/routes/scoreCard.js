import { Router } from "express";
import ScoreCard from "../models/ScoreCard";

const saveScoreCard = async (subject, name, score) => {
    const existing = await ScoreCard.findOne({ subject, name });
    if (existing){
        await ScoreCard.deleteOne({ subject, name })
        const newScoreCard = new ScoreCard({ subject, name, score });
        console.log("Updated ScoreCard", newScoreCard);
        newScoreCard.save();
        return "Updating";
    }
    try {
        const newScoreCard = new ScoreCard({ subject, name, score });
        console.log("Created ScoreCard", newScoreCard);
        newScoreCard.save();
        return "Adding";
    } catch (e) { throw new Error("User creation error: " + e); }
};

const deleteDB = async () => {
    try {
        await ScoreCard.deleteMany({});
    } catch (e) { throw new Error("Database deletion failed"); }
};

const queryScoreCard = async (type, queryString) => {
    if(type === 'name')
        return await ScoreCard.find({ 'name': queryString });
    else
        return await ScoreCard.find({ 'subject': queryString });
};

const router = Router();
router.delete("/cards", async (_, res) => {
    await deleteDB()
    res.send({ message: "Database cleared" })
});

router.post("/card", async (req, res) => {
    let { subject, name, score } = req.body
    let status = await saveScoreCard(subject, name, score)
    res.send({ message: `${status} (${name}, ${subject}, ${score})`, card: true})
});

router.get("/cards", async (req, res) => {
    let { type, queryString } = req.query
    let queries = await queryScoreCard(type, queryString)
    let arr = []
    queries.map((item) => {
        arr.push(`Found card with ${type}: (${item.name}, ${item.subject}, ${item.score})`)
    })
    res.send({  messages: arr, message: `${type} (${queryString}) not found!`})
});

export default router;