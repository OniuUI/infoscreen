import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {apiService} from "./api/apiservice";
import { v4 as uuidv4 } from 'uuid';
import './css/taskcard.css';
import CommentBox from "./commentbox";
import CommentEntry from "./commentEntry";
import {User, Task, Comment} from'./utils/types';


interface CardProps {
    handleDeleteTask: (taskId: string) => void;
    users: User[];
    task: Task;
    manager: User;
    subject: string;
    dueBy: string;
    //setTask: Dispatch<SetStateAction<Task>>;
    //updateColumnWithTask: (task: Task) => void;
}


const Card: React.FC<CardProps> = ({users, task, manager, subject, dueBy, handleDeleteTask}) => {
    const [localTask, setLocalTask] = useState<Task>(task);
    const [selectedUser, setSelectedUser] = useState<string>(task.assignedTo._id);
    const [editedSubject, setEditedSubject] = useState(task.subject);
    const [editedDescription, setEditedDescription] = useState(task.description);
    const [editedDueBy, setEditedDueBy] = useState(task.dueBy);
    const userIdent = localStorage.getItem('userIdent');
    const userRole = localStorage.getItem('userRole');


    const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedSubject(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedDescription(event.target.value);
    };

    const handleSubjectBlur = async () => {
        // Make an API call to update the task
        const updatedTask = {...task, subject: editedSubject};
        try {
            await apiService.put(`/kaizen/updateTask/${task.id}?userIdent=${userIdent}`, updatedTask);
            //setTask(updatedTask);
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleDescriptionBlur = async () => {
        // Make an API call to update the task
        const updatedTask = { ...task, description: editedDescription };
        try {
            await apiService.put(`/kaizen/updateTask/${task.id}?userIdent=${userIdent}`, updatedTask);
            setLocalTask(updatedTask)
            //setTask(updatedTask);
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleDueByChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedDueBy(event.target.value);
    };

    const handleDueByBlur = async () => {
        // Make an API call to update the task
        const updatedTask = { ...task, dueBy: editedDueBy };
        try {
            await apiService.put(`/kaizen/updateTask/${task.id}?userIdent=${userIdent}`, updatedTask);
            //setTask(updatedTask);
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

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

    const handleAddComment = async (commentText: string) => {
        try {
            const comment = { id: uuidv4(), text: commentText, author: 'User' }; // Replace 'User' with the actual user
            const response = await apiService.post(`/kaizen/addComment/${task.id}`, comment);
            console.log('Response:', response);
            if (response.success) {
                // Update the task state with the new comment
                task.comments.push(response.comment);
                console.log(task.comments)
                console.log(response.comment)
                //setTask((prevTask: Task) => ({...prevTask, comments: [...prevTask.comments, response.comment]}));
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    return (
        <div className="card">
            <div className="card__header">
                <input type="text" value={editedSubject} onChange={handleSubjectChange} onBlur={handleSubjectBlur}
                       readOnly={userRole !== 'admin' && userIdent !== task.manager._id}/>
            </div>
            <div className="card__body">
                Description:
                <textarea value={editedDescription} onChange={handleDescriptionChange} onBlur={handleDescriptionBlur}
                          readOnly={userRole !== 'admin' && userIdent !== task.manager._id}/>
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
                    <input type="date" value={editedDueBy} onChange={handleDueByChange} onBlur={handleDueByBlur}
                           readOnly={userRole !== 'admin' && userIdent !== task.manager._id}/>
                </label>
                <CommentBox handleAddComment={handleAddComment} />
                {task.comments && task.comments.map((comment: Comment) => (
                    <CommentEntry
                        key={comment.id}
                        comment={comment}
                        task={task}
                    />
                ))}
            </div>
            <div className="card__footer">
                {((task.manager._id === manager._id) || (localStorage.getItem("role") === 'Admin')) && (
                    <button className="delete-button" onClick={handleDelete}>Delete</button>
                )}
            </div>
        </div>
    );
};

export default Card;