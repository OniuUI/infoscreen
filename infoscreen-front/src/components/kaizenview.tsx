import React, { useEffect, useState } from 'react';
import { apiService } from "./api/apiservice";
import { User, Task, Comment } from './utils/types';


interface Column {
    title: string;
    tasks: Task[];
}

const ReadOnlyKaizenBoard: React.FC = () => {
    const [columns, setColumns] = useState<Column[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await apiService.get('/kaizen/getTasks');
                const tasks = response;

                if (!Array.isArray(tasks)) {
                    console.error('Invalid tasks data:', tasks);
                    return;
                }

                const newTasks = tasks.filter((task: Task) => task.status === 'New');
                const progressTasks = tasks.filter((task: Task) => task.status === 'In Progress');
                const completedTasks = tasks.filter((task: Task) => task.status === 'Completed');
                const closedTasks = tasks.filter((task: Task) => task.status === 'Closed');
                const canceledTasks = tasks.filter((task: Task) => task.status === 'Canceled');

                setColumns([
                    { title: 'New', tasks: newTasks },
                    { title: 'In Progress', tasks: progressTasks },
                    { title: 'Completed', tasks: completedTasks },
                    { title: 'Closed', tasks: closedTasks },
                    { title: 'Canceled', tasks: canceledTasks },
                ]);
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };

        fetchTasks();
    }, []);

    return (
        <div>
            <div className="bg-blue-500 text-white p-4 mb-4">
                This is a test box.
            </div>
        <div className="kaizen-board grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4">

            {columns.map(column => (
                <div className="column bg-gray-100 p-4 rounded-lg shadow-md" key={column.title}>
                    <h2 className="text-xl font-bold mb-4">{column.title}</h2>
                    {column.tasks.map(task => (
                        <div className="task bg-white p-4 mb-4 rounded-lg shadow-sm" key={task.id}>
                            <h3 className="text-lg font-semibold">{task.subject}</h3>
                            <p className="text-gray-700">{task.description}</p>
                            {task.comments.map(comment => (
                                <div className="comment mt-2 p-2 bg-gray-50 rounded-md" key={comment.id}>
                                    <p className="comment__text">
                                        <span className="comment__author font-semibold">{comment.author.firstName} {comment.author.lastName}</span> - {comment.text} - <br /> <span className="text-xs text-gray-500">{comment.created}</span>
                                        {comment.edited && <span className="comment__edited text-xs text-red-500 ml-2">Edited</span>}
                                    </p>
                                    {comment.edited && <div className="comment__edited-date text-xs text-gray-400 mt-1">Last edited: {comment.lastEdited}</div>}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
        </div>
    );
};

export default ReadOnlyKaizenBoard;
