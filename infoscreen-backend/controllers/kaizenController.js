const {getDb} = require("../db");

// Route to fetch existing tasks
exports.getExsistingTasks = async (req, res) => {
    try {
        const db = getDb();
        const tasks = await db.collection('tasks').find().toArray();
        //console.log(tasks);
        res.send(tasks);
    } catch (err) {
        res.status(500).send({ error: "Unable to fetch tasks." });
    }
};

// Route to create a new task
exports.createNewTask =  async (req, res) => {
    try {
        const db = getDb();
        const task = req.body;
        console.log(task)
        const result = await db.collection('tasks').insertOne(task);
        console.log(`Task created with ID: ${result.insertedId}`);
        res.send({ success: true, task: { ...task, _id: result.insertedId } });
    } catch (err) {
        res.status(500).send({ error: "Unable to create task." });
    }
};

// Route to update a task
exports.updateTask = async (req, res) => {
    try {
        const db = getDb();
        const taskId = req.params.id;
        let updatedTask = req.body;

        // Remove the _id field from the updatedTask object
        delete updatedTask._id;

        const result = await db.collection('tasks').updateOne(
            { id: taskId }, // filter
            { $set: updatedTask }, // update
            { upsert: false } // options
        );
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Task not found.' });
        }
        console.log(`Task updated with ID: ${taskId}`);
        res.send({ success: true });
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: "Unable to update task."  });
    }
};
