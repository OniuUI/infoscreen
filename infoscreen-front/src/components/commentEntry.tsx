import React, {Dispatch, SetStateAction, useState} from "react";
import {Task, Comment} from "./utils/types";
import {apiService} from "./api/apiservice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";


interface CommentProps {
    key: string;
    comment: Comment;
    task: Task;
    setTask: Dispatch<SetStateAction<Task>>;
}

const CommentEntry: React.FC<CommentProps> = ({comment, task, setTask }) => {
    const [localTask, setLocalTask] = useState<Task>(task);
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.text);

    // Add a new state variable for the dropdown menu visibility
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Function to toggle the dropdown menu visibility
    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };


    const handleEditComment = async (task: Task, commentId: string, newText: string) => {
        try {
            const comment = {
                text: newText,
                edited: true, // Set edited to true
                lastEdited: new Date().toISOString() // Set lastEdited to the current date and time
            };
            const response = await apiService.put(`/kaizen/editComment/${task.id}/${commentId}`, comment);
            if (response.success) {
                // Update the comment in the task in the frontend
                const commentIndex = task.comments.findIndex(comment => comment.id === commentId);
                if (commentIndex !== -1) {
                    const updatedTask = { ...task };
                    updatedTask.comments[commentIndex].text = newText;
                    updatedTask.comments[commentIndex].edited = true; // Update edited
                    updatedTask.comments[commentIndex].lastEdited = new Date().toISOString(); // Update lastEdited
                    task.comments[commentIndex].text = newText;
                    task.comments[commentIndex].edited = true; // Update edited
                    task.comments[commentIndex].lastEdited = new Date().toISOString(); // Update lastEdited
                    setLocalTask(updatedTask);
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
            if (response.success) {
                // Update the task in the frontend
                const updatedTask = { ...task, comments: task.comments.filter(comment => comment.id !== commentId) };
                task.comments = task.comments.filter(comment => comment.id !== commentId);
                setLocalTask(updatedTask)
                setTask(updatedTask);
            }
            else {
                console.error('Failed to delete comment:', response.error);
            }
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

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
        <div className="comment">
            <div className="comment__content">
                {isEditing ? (
                    <div>
                        <input type="text" value={editedText} onChange={e => setEditedText(e.target.value)}/>
                        <button onClick={handleSave}>Save</button>
                    </div>
                ) : (
                    <p className="comment__text">
                        <span
                            className="comment__author">{comment.author.firstName} {comment.author.lastName}</span> - {comment.text} - <br/> <span className="timestamp">  {comment.created}</span>
                        {comment.edited &&
                            <span className="comment__edited">Edited</span>} {/* Display "Edited" label */}
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
            {comment.edited && <div className="comment__edited-date">Last edited: {comment.lastEdited}</div>} {/* Display last edited date */}
        </div>
    );
};


export default CommentEntry;