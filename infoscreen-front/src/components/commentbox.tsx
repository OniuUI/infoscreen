import React, {useState, useRef, SetStateAction, Dispatch} from 'react';
import {Task, Comment} from './utils/types';



interface CommentBoxProps {
    task: Task;
    handleAddComment: (commentText: string) => Promise<void>;
    comments: Comment[]; // Add this line
    setComments: Dispatch<SetStateAction<Comment[]>>; // Add this line
}

const CommentBox: React.FC<CommentBoxProps> = ({ task, handleAddComment, comments, setComments }) => {
    const [comment, setComment] = useState('');
    const [isCommentFieldFocused, setIsCommentFieldFocused] = useState(false);
    const timer = useRef<NodeJS.Timeout | null>(null);

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