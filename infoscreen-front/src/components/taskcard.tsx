import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {apiService} from "./api/apiservice";
import { v4 as uuidv4 } from 'uuid';
import './css/taskcard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import CommentBox from "./commentbox";
import {User, Task} from'./utils/types';



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


interface CommentProps {
    comment: Comment;
    task: Task;
    handleEditComment: (task: Task, commentId: string, newText: string) => void;
    handleDeleteComment: (task: Task, commentId: string) => void;
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>; // Add this line
}

const Comment: React.FC<CommentProps> = ({ setComments, comment, task, handleEditComment, handleDeleteComment }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.text);

    // Add a new state variable for the dropdown menu visibility
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Function to toggle the dropdown menu visibility
    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        handleEditComment(task, comment.id, editedText);
        setIsEditing(false);
        setComments((prevComments: Comment[]) => prevComments.map((c: Comment) => c.id === comment.id ? {...c, text: editedText} : c)); // Update the comments state
    };

    const handleDelete = () => {
        handleDeleteComment(task, comment.id);
        setComments((prevComments: Comment[]) => prevComments.filter((c: Comment) => c.id !== comment.id)); // Update the comments state
    };
    // Add useEffect hook here
    useEffect(() => {
        // Update the editedText state whenever the comment.text prop changes
        setEditedText(comment.text);
    }, [comment.text]);
    return (
        <div className="comment">
            <div className="comment__content">
                {isEditing ? (
                    <div>
                        <input type="text" value={editedText} onChange={e => setEditedText(e.target.value)}/>
                        <button onClick={handleSave}>Save</button>
                    </div>
                ) : (
                    <p className="comment__text"><span
                        className="comment__author">{comment.author}</span> - {comment.text}
                    </p>
                )}
            </div>
            <div className="comment__actions">
                <FontAwesomeIcon icon={isDropdownVisible ? faChevronUp : faChevronDown} onClick={toggleDropdown}/>
                {isDropdownVisible && (  // Dropdown menu
                    <div className="dropdown-menu">
                        <div className="dropdown-item" onClick={() => {
                            handleEdit();
                            toggleDropdown();
                        }}>Edit
                        </div>
                        <div className="dropdown-item" onClick={() => {
                            handleDelete();
                            toggleDropdown();
                        }}>Delete
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};



const Card: React.FC<CardProps> = ({users, task: initialTask, manager, subject, dueBy, handleDeleteTask}) => {
    const [task, setTask] = useState<Task>(initialTask);
    const [selectedUser, setSelectedUser] = useState<string>(task.assignedTo._id);
    const [editedSubject, setEditedSubject] = useState(task.subject);
    const [editedDescription, setEditedDescription] = useState(task.description);
    const [editedDueBy, setEditedDueBy] = useState(task.dueBy);
    const userIdent = localStorage.getItem('userIdent');
    const userRole = localStorage.getItem('userRole');
    const [comments, setComments] = useState(task.comments);

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
            setTask(updatedTask);
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleDescriptionBlur = async () => {
        // Make an API call to update the task
        const updatedTask = { ...task, description: editedDescription };
        try {
            await apiService.put(`/kaizen/updateTask/${task.id}?userIdent=${userIdent}`, updatedTask);
            setTask(updatedTask);
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
            setTask(updatedTask);
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
                // Add the new comment to the comments state
                setComments(prevComments => [...prevComments, response.comment]);
                // Also update the task state
                setTask(prevTask => ({...prevTask, comments: [...prevTask.comments, response.comment]}));
            }
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
                <CommentBox task={task} handleAddComment={handleAddComment} comments={comments} setComments={setComments} />
                {task.comments && task.comments.map((comment: Comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        task={task}
                        handleEditComment={handleEditComment}
                        handleDeleteComment={handleDeleteComment}
                        setComments={setComments} // Pass down the setComments function
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