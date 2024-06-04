const accessController = require('./accessController');
const {getDb} = require("../db");
const mailService = require("../mailservice/mailService");
const DataBroker = require("../utils/databroker");

const dataBroker = new DataBroker();

/**
 * @swagger
 * tags:
 *   name: Kaizen
 *   description: Kaizen task management
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags: [Kaizen]
 *     description: Fetch existing tasks
 */
exports.getExsistingTasks = async (req, res) => {
    try {
        const db = getDb();
        const tasks = await db.collection('tasks').find().toArray();
        res.send(tasks);
    } catch (err) {
        res.status(500).send({ error: "Unable to fetch tasks." });
    }
};

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     tags: [Kaizen]
 *     description: Get a task by ID
 */
exports.getTaskById = async (req, res) => {
    try {
        const db = getDb();
        const taskId = req.params.id;

        const task = await db.collection('tasks').findOne({ id: taskId });

        if (!task) {
            return res.status(404).send({ error: 'Task not found.' });
        }

        res.send({ success: true, task });
    } catch (err) {
        res.status(500).send({ error: "Unable to fetch task." });
    }
};

/**
 * @swagger
 * /tasks:
 *   post:
 *     tags: [Kaizen]
 *     description: Create a new task
 */
exports.createNewTask =  async (req, res) => {
    try {
        const db = getDb();
        const task = req.body;
        const result = await db.collection('tasks').insertOne(task);


        const subject = 'New Task Assigned';
        const html = `<p>A new task titled "${task.subject}" has been assigned to you by ${task.manager.firstName} ${task.manager.lastName}. Please check the Kaizen board for details. <a href="${process.env.WEBSITE_URL}/kaizen">Click here to view the task.</a></p>`;

        await mailService.sendEmail(task.assignedTo.email, subject, html);

        res.send({ success: true, task: { ...task, _id: result.insertedId } });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Unable to create task. ", err });
    }
};

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     tags: [Kaizen]
 *     description: Update a task
 */
exports.updateTask = async (req, res) => {
    try {
        const db = getDb();
        const taskId = req.params.id;
        let updatedTask = req.body;

        const userIdent = req.query.userIdent;
        const role = req.query.role;

        const task = await db.collection('tasks').findOne({ id: taskId });

        if (!(role === 'admin' || userIdent === task.manager._id)) {
            return res.status(403).send({ error: 'You do not have the right permissions to update this task.' });
        }
        delete updatedTask._id;

        const result = await db.collection('tasks').updateOne(
            { id: taskId }, // filter
            { $set: updatedTask }, // update
            { upsert: false } // options
        );
        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Task not found.' });
        }
        const subject = 'Task Updated';
        const html = `<p>The task: "${task.subject}" that has been assigned to ${task.assignedTo.firstName} ${task.assignedTo.lastName}. Has been updated Please check the Kaizen board for details. <a href="${process.env.WEBSITE_URL}/kaizen">Click here to view the task.</a></p>`;
        await mailService.sendEmail(task.manager.email, subject, html);

        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: "Unable to update task."  });
    }
};

/**
 * @swagger
 * /tasks/{id}/comments:
 *   post:
 *     tags: [Kaizen]
 *     description: Add a comment to a task
 */
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
        const task = await dataBroker.getTasks(taskId);
        const subject = 'User added comment to task';
        const html = `<p>The task: "${task.subject}" has a new comment, added by ${comment.author.firstName} ${comment.author.lastName}. Please check the Kaizen board for details. <a href="${process.env.WEBSITE_URL}/kaizen">Click here to view the task.</a></p>`;

        await mailService.sendEmail(task.manager.email, subject, html);

        res.send({ success: true, comment });
    } catch (err) {
        res.status(500).send({ error: "Unable to add comment." });
    }
};

/**
 * @swagger
 * /tasks/{taskId}/comments/{commentId}:
 *   put:
 *     tags: [Kaizen]
 *     description: Edit a comment in a task
 */
exports.editComment = async (req, res) => {
    try {
        const db = getDb();
        const taskId = req.params.taskId;
        const commentId = req.params.commentId;
        const updatedComment = req.body;
        console.log(updatedComment);

        const result = await db.collection('tasks').updateOne(
            { id: taskId, "comments.id": commentId }, // filter
            {
                $set: {
                    "comments.$.text": updatedComment.text,
                    "comments.$.edited": updatedComment.edited, // Set edited to true
                    "comments.$.lastEdited": updatedComment.lastEdited // Set lastEdited to the current date and time
                }
            } // update
        );

        if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'Comment not found.' });
        }

        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: "Unable to update comment." });
    }
};


/**
 * @swagger
 * /tasks/{taskId}/comments/{commentId}:
 *   delete:
 *     tags: [Kaizen]
 *     description: Delete a comment from a task
 */
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

        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: "Unable to delete comment." });
    }
};

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     tags: [Kaizen]
 *     description: Delete a task
 */
exports.deleteTask = async (req, res) => {
    try {
        const db = getDb();
        const taskId = req.params.id;
        const userIdent = req.query.userIdent;

        const role = await accessController.getRoleByUserId(userIdent);

        if (role !== 'admin' && role !== 'manager') {
            return res.status(403).send({ error: 'You do not have the right permissions to delete this task.' });
        }

        const result = await db.collection('tasks').deleteOne({ id: taskId });

        if (result.deletedCount === 0) {
            return res.status(404).send({ error: 'Task not found.' });
        }

        const task = await dataBroker.getTasks(taskId);
        const subject = 'A task that was assigned to you, has been deleted';
        const html = `<p>The task titled "${task.subject}" has been deleted by ${task.manager.firstName} ${task.manager.lastName}. Please contact the user if you think this is a mistake.  <a href="${process.env.WEBSITE_URL}/kaizen">Click here to view the board.</a></p>`;

        await mailService.sendEmail(task.assignedTo.email, subject, html);

        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ error: "Unable to delete task." });
    }
};