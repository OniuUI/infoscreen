import React, {useState, useRef, SetStateAction, Dispatch} from 'react';
import {v4 as uuidv4} from "uuid";
import {apiService} from "./api/apiservice";
import {Task, User} from "./utils/types";

interface CommentBoxProps {
    task: Task;
    setTask: Dispatch<SetStateAction<Task>>;

}

const CommentBox: React.FC<CommentBoxProps> = ({ task, setTask }) => {
    const [localTask, setLocalTask] = useState<Task>(task);
    const [comment, setComment] = useState('');
    const [isCommentFieldFocused, setIsCommentFieldFocused] = useState(false);
    const timer = useRef<NodeJS.Timeout | null>(null);
    const [LoggedInUser, setLoggedInUser] = useState<User | null>()

    var fetchUser = async () => {
        try {
            var userIdent = localStorage.getItem('userIdent')
            console.log('User Ident:', userIdent);
            const response = await apiService.get('/users/' + userIdent);

                console.log('User:', response.user);
                setLoggedInUser(response.user);
                return response.user;

            console.log('Loggedinuser:', LoggedInUser);

        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    }

    const handleAddComment = async (commentText: string) => {
        try {
            const user = await fetchUser();
            const userId = user?._id;
            const minifiedUser = { firstName: user?.firstName, lastName: user?.lastName, id: userId };
            const comment = {
                id: uuidv4(),
                text: commentText,
                author: minifiedUser, // Store the minified user object in the comment
                created: new Date().toISOString() // Add a timestamp to the comment
            };
            const response = await apiService.post(`/kaizen/addComment/${localTask.id}`, comment);
            console.log('Response:', response);
            if (response.success) {
                // Update the task state with the new comment
                setTask((prevTask: Task) => ({
                    ...prevTask,
                    comments: [...(prevTask.comments || []), response.comment]
                }));
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