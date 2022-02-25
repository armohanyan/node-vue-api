
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router();
// Get Posts

// loadPosts();
router.get('/', async (req, res) => {
    let posts = await loadPosts();
    res.send(await posts.find({}).toArray());
});

// Add post
router.post("/", async (req, res) => {
    const posts = await loadPosts();
    let { title, text } = req.body;
    await posts.insertOne({
        title,
        text,
        createdAt: new Date()
    });
    res.status(201).send("Wow!! you create a new post");
});

// Delete Posts 
router.delete("/:id", async (req, res) => {
    const posts = await loadPosts();
    await posts.deleteOne({
        _id: ObjectId(req.params.id)
    });
    res.status(200).send("Wow you deleted post!!")
});

module.exports = router;
