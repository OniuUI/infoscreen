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
            await apiService.put(`/kaizen/updateTask/${task.id}?userIdent=${userIdent}&role=${userRole}`, updatedTask);
            //setTask(updatedTask);
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleDescriptionBlur = async () => {
        // Make an API call to update the task
        const updatedTask = { ...localTask, description: editedDescription };
        try {
            await apiService.put(`/kaizen/updateTask/${localTask.id}?userIdent=${userIdent}&role=${userRole}`, updatedTask);
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
        const updatedTask = { ...localTask, dueBy: editedDueBy };
        try {
            await apiService.put(`/kaizen/updateTask/${localTask.id}?userIdent=${userIdent}&role=${userRole}`, updatedTask);
            //setTask(updatedTask);
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleDelete = () => {
        handleDeleteTask(localTask.id);
    };

    const handleUserChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUser(event.target.value);

        // Update the task in the backend
        const updatedTask = { ...localTask, assignedTo: { _id: event.target.value } };
        try {
            const response = await apiService.put(`/kaizen/updateTask/${localTask.id}`, updatedTask);
            console.log('Response:', response);
            if (response.success) {
                // Update the task in the frontend
                localTask.assignedTo._id = event.target.value;
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const assignedUser = users.find(user => user._id === selectedUser);


    return (
        <div className="mx-auto rounded shadow-md overflow-hidden flex flex-col bg-gray-900 text-blue-400">
            <div className="text-left p-5 bg-gray-700 border-b border-brown-600">
                <input type="text" value={editedSubject} onChange={handleSubjectChange} onBlur={handleSubjectBlur}
                       readOnly={userRole !== 'admin' && userIdent !== localTask.manager._id} className="w-full px-5 py-3 my-2 border border-gray-700 rounded box-border transition-colors bg-gray-900 text-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none"/>
            </div>
            <div className="text-left p-5 flex-grow bg-white bg-opacity-10 text-green-300">
            <textarea value={editedDescription} onChange={handleDescriptionChange} onBlur={handleDescriptionBlur}
                      readOnly={userRole !== 'admin' && userIdent !== localTask.manager._id} className="w-full px-5 py-3 my-2 border border-gray-700 rounded box-border transition-colors bg-gray-900 text-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none"/>
                <p>Manager: {localTask.manager ? `${localTask.manager.firstName} ${localTask.manager.lastName}` : 'Unassigned'}</p>
                <label>
                    Assigned to:
                    <select value={selectedUser} onChange={handleUserChange} className="w-full px-5 py-3 my-2 border border-gray-700 rounded box-border transition-colors bg-gray-900 text-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none">
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
                           readOnly={userRole !== 'admin' && userIdent !== localTask.manager._id} className="w-full px-5 py-3 my-2 border border-gray-700 rounded box-border transition-colors bg-gray-900 text-blue-400 focus:border-blue-400 focus:ring-blue-400 focus:outline-none"/>
                </label>
                <CommentBox task={localTask} setTask={setLocalTask} />
                {localTask.comments && localTask.comments.map((comment: Comment) => (
                    <CommentEntry
                        setTask={setLocalTask}
                        key={comment.id}
                        comment={comment}
                        task={task}
                    />
                ))}
            </div>
            <div className="text-left p-5 bg-red-400 border-b border-brown-600">
                {((localTask.manager._id === manager._id) || (localStorage.getItem("role") === 'Admin')) && (
                    <button className="w-full text-gray-900 py-3.5 my-2 border-none rounded cursor-pointer transition-colors hover:bg-red-700" onClick={handleDelete}>Delete</button>
                )}
            </div>
        </div>
    );
};

export default Card;