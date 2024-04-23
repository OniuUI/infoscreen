import React, {useState, useRef, SetStateAction, Dispatch} from 'react';
import {v4 as uuidv4} from "uuid";
import {apiService} from "./api/apiservice";
import {Task} from "./utils/types";

interface CommentBoxProps {
    task: Task;
    setTask: Dispatch<SetStateAction<Task>>;

}

const CommentBox: React.FC<CommentBoxProps> = ({ task, setTask }) => {
    const [localTask, setLocalTask] = useState<Task>(task);
    const [comment, setComment] = useState('');
    const [isCommentFieldFocused, setIsCommentFieldFocused] = useState(false);
    const timer = useRef<NodeJS.Timeout | null>(null);

    const handleAddComment = async (commentText: string) => {
        try {
            const comment = { id: uuidv4(), text: commentText, author: 'User' }; // Replace 'User' with the actual user
            const response = await apiService.post(`/kaizen/addComment/${localTask.id}`, comment);
            console.log('Response:', response);
            if (response.success) {
                // Update the task state with the new comment
               // localTask.comments.push(response.comment);
                console.log(localTask.comments)
                console.log(response.comment)
                setTask((prevTask: Task) => ({...prevTask, comments: [...prevTask.comments, response.comment]}));
            }
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);
    };

    const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await handleAddComment(comment);
        setComment('');
    };

    const handleFocus = () => {
        if (timer.current) clearTimeout(timer.current);
        setIsCommentFieldFocused(true);
    };

    const handleBlur = () => {
        timer.current = setTimeout(() => {
            setIsCommentFieldFocused(false);
        }, 200);
    };

    return (
        <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
                value={comment}
                onChange={handleCommentChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Add a comment"
            />
            {isCommentFieldFocused && (
                <button className="add-comment-button" type="submit">Add</button>
            )}
        </form>
    );
};

export default CommentBox;