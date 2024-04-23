const accessController = require('./accessController');
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
    console.log('updateTask called'); // Log when the function is called
    try {
        const db = getDb();
        const taskId = req.params.id;
        let updatedTask = req.body;

        console.log(`Updating task with ID: ${taskId}`); // Log the ID of the task being updated

        // Extract userIdent and role from the request
        const userIdent = req.query.userIdent;
        const role = req.query.role;

        console.log(`userIdent: ${userIdent}, role: ${role}`); // Log the userIdent and role
        // Get the task from the database
        const task = await db.collection('tasks').findOne({ id: taskId });

        // Check if the user has the right permissions
        if (!(role === 'admin' || userIdent === task.manager._id)) {
            console.log('Permission denied'); // Log when the user does not have the right permissions
            return res.status(403).send({ error: 'You do not have the right permissions to update this task.' });
        }

        // Remove the _id field from the updatedTask object
        delete updatedTask._id;

        const result = await db.collection('tasks').updateOne(
            { id: taskId }, // filter
            { $set: updatedTask }, // update
            { upsert: false } // options
        );
        if (result.matchedCount === 0) {
            console.log('Task not found'); // Log when the task is not found
            return res.status(404).send({ error: 'Task not found.' });
        }
        console.log(`Task updated with ID: ${taskId}`); // Log when the task is successfully updated
        res.send({ success: true });
    } catch (err) {
        console.log('Error updating task:', err); // Log any errors that occur
        res.status(500).send({ error: "Unable to update task."  });
    }
};

// Route to add a comment to a task
exports.addComment = async (req, res) => {
    try {
        const db = getDb();
        const taskId = req.params.id;
        const comment = req.body;
        const result = await db.collection('tasks').updateOne(
            { id: taskId },
            { $push: { comments: comment } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Task not found.' });
        }
        console.log(`Comment added to task with ID: ${taskId}`);
        res.send({ success: true, comment });
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: "Unable to add comment." });
    }
};

exports.editComment = async (req, res) => {
    try {
        const db = getDb();
        const taskId = req.params.taskId;
        const commentId = req.params.commentId;
        const updatedComment = req.body;

        const result = await db.collection('tasks').updateOne(
            { id: taskId, "comments.id": commentId }, // filter
            { $set: { "comments.$.text": updatedComment.text } } // update
        );

        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Comment not found.' });
        }

        console.log(`Comment updated in task with ID: ${taskId}`);
        res.send({ success: true });
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: "Unable to update comment." });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const db = getDb();
        const taskId = req.params.taskId;
        const commentId = req.params.commentId;

        const result = await db.collection('tasks').updateOne(
            { id: taskId }, // filter
            { $pull: { comments: { id: commentId } } } // update
        );

        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Comment not found.' });
        }

        console.log(`Comment deleted from task with ID: ${taskId}`);
        res.send({ success: true });
    } catch (err) {
        console.log(err)
        res.status(500).send({ error: "Unable to delete comment." });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const db = getDb();
        const taskId = req.params.id;
        const userIdent = req.query.userIdent; // Extract userIdent from the query parameters

        // Get the role of the user
        const role = await accessController.getRoleByUserId(userIdent);

        // Check if the user has the right permissions
        if (role !== 'admin' && role !== 'manager') {
            return res.status(403).send({ error: 'You do not have the right permissions to delete this task.' });
        }

        // Delete the task
        const result = await db.collection('tasks').deleteOne({ id: taskId });

        if (result.deletedCount === 0) {
            return res.status(404).send({ error: 'Task not found.' });
        }

        console.log(`Task deleted with ID: ${taskId}`);
        res.send({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Unable to delete task." });
    }
};