import React, {useEffect, useState} from 'react';
import {apiService} from "./api/apiservice";
import { v4 as uuidv4 } from 'uuid';

interface User {
    _id: string;
    firstName: string;
    lastName: string;

}

interface CardProps {
    users: User[];
    task: Task;
    manager: User;
    subject: string;
    dueBy: string;
    handleDeleteTask: (taskId: string) => void;
}

interface Comment {
    id: string;
    text: string;
    author: string;
}

interface Task {
    _id: { $oid: string };
    id: string;
    manager: User;
    subject: string;
    dueBy: string;
    description: string;
    assignedTo: User;
    status: string;
    comments: Comment[];
}

interface CommentProps {
    comment: Comment;
    task: Task;
    handleEditComment: (task: Task, commentId: string, newText: string) => void;
    handleDeleteComment: (task: Task, commentId: string) => void;
}

const Comment: React.FC<CommentProps> = ({ comment, task, handleEditComment, handleDeleteComment }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.text);
    const userIdent = localStorage.getItem('userIdent');
    const role = localStorage.getItem('role');

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        handleEditComment(task, comment.id, editedText);
        setIsEditing(false);
    };

    const handleDelete = () => {
        handleDeleteComment(task, comment.id);
    };

    return (
        <div>
            {isEditing ? (
                <div>
                    <input type="text" value={editedText} onChange={e => setEditedText(e.target.value)} />
                    <button onClick={handleSave}>Save</button>
                </div>
            ) : (
                <p>{comment.text} - {comment.author}</p>
            )}
            <div>
                <button onClick={handleEdit}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};

const Card: React.FC<CardProps> = ({ users, task: initialTask, manager, subject, dueBy, handleDeleteTask }) => {
    const [task, setTask] = useState<Task>(initialTask);
    const [selectedUser, setSelectedUser] = useState<string>(task.assignedTo._id);
    const handleDelete = () => {
        handleDeleteTask(task.id);
    };

    const handleUserChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUser(event.target.value);

        // Update the task in the backend
        const updatedTask = { ...task, assignedTo: { _id: event.target.value } };
        try {
            const response = await apiService.put(`/kaizen/updateTask/${task.id}`, updatedTask);
            console.log('Response:', response);
            if (response.success) {
                // Update the task in the frontend
                task.assignedTo._id = event.target.value;
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const assignedUser = users.find(user => user._id === selectedUser);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const comment = { id: uuidv4(), text: newComment, author: 'User' }; // Replace 'User' with the actual user
            const response = await apiService.post(`/kaizen/addComment/${task.id}`, comment);
            console.log('Response:', response);
            if (response.success) {
                // Add the new comment to the task in the frontend
                task.comments.push(response.comment);
            }
            setNewComment('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const handleEditComment = async (task: Task, commentId: string, newText: string) => {
        try {
            const comment = { text: newText };
            const response = await apiService.put(`/kaizen/editComment/${task.id}/${commentId}`, comment);
            console.log('Response:', response);
            if (response.success) {
                // Update the comment in the task in the frontend
                const commentIndex = task.comments.findIndex(comment => comment.id === commentId);
                if (commentIndex !== -1) {
                    const updatedTask = { ...task };
                    updatedTask.comments[commentIndex].text = newText;
                    setTask(updatedTask);
                }
            }
        } catch (error) {
            console.error('Failed to edit comment:', error);
        }
    };


    const handleDeleteComment = async (task: Task, commentId: string) => {
        try {
            const response = await apiService.delete(`/kaizen/deleteComment/${task.id}/${commentId}`);
            console.log('Response:', response);
            if (response.success) {
                // Create a new task object with the updated comments array
                const updatedTask = { ...task, comments: task.comments.filter(comment => comment.id !== commentId) };
                // Update the task state
                setTask(updatedTask);
            }
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    return (
        <div className="card">
            <h3>{subject}</h3>
            <p>{task.description}</p>
            <p>Manager: {task.manager ? `${task.manager.firstName} ${task.manager.lastName}` : 'Unassigned'}</p>
            <label>
                Assigned to:
                <select value={selectedUser} onChange={handleUserChange}>
                    {users.map((user) => (
                        <option key={user._id} value={user._id}>
                            {user.firstName} {user.lastName}
                        </option>
                    ))}
                </select>
            </label>
            <p>Assigned To: {assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : 'Unassigned'}</p>
            <label>
                Due by:
                <input type="date" defaultValue={dueBy}/>
            </label>
            <form onSubmit={handleAddComment}>
                <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)}
                       placeholder="Add a comment" required/>
                <button type="submit">Add Comment</button>
            </form>
            {task.comments && task.comments.map((comment: Comment) => (
                <Comment
                    key={comment.id}
                    comment={comment}
                    task={task}
                    handleEditComment={handleEditComment}
                    handleDeleteComment={handleDeleteComment}
                />
            ))}
            {((task.manager._id === manager._id) || (localStorage.getItem("role") === 'Admin')) && (
                <button onClick={handleDelete}>Delete</button>
            )}
        </div>
    );
};

export default Card;