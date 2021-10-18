const express = require('express');
const tasks = require('../modals/task');
const auth = require('../middleware/auth');
const router = new express.Router();

// create new tasks
router.post('/tasks', auth, async(req, res) => {
    const task = new tasks({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
});

//fetching all tasks
router.get('/tasks', auth, async(req, res) => {
    try {
        const readAllTasks = await tasks.find({ completed: false, owner: req.user._id });
        res.status(201).send(readAllTasks);
    } catch (e) {
        res.status(401).send(e);
    }
})
router.get('/tasks/completed', auth, async(req, res) => {
    try {
        const readAllTasks = await tasks.find({ completed: true, owner: req.user._id });
        res.status(201).send(readAllTasks);
    } catch (e) {
        res.status(401).send(e);
    }
})
router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id

    try {
        const task = await tasks.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(401).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})
router.delete('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id;
    try {
        const task = await tasks.findOneAndDelete({ _id, owner: req.user._id });
        if (!task) {
            return res.status(400).send("No tasks!");
        }
        res.status(200).send(task);
    } catch (e) {
        res.status(500).send(e);
    }
})

router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body);

    try {
        const task = await tasks.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task)
            return res.status(404).send("No task!!");
        updates.forEach((val) => task[val] = req.body[val]);
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        return res.status(400).send(e);
    }
})


module.exports = router;