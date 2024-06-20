import React, { useEffect, useState } from 'react';
import { apiService } from "./api/apiservice";
import { User, Task, Comment } from './utils/types';

interface Column {
    title: string;
    tasks: Task[];
}

// Task Component
const TaskComponent: React.FC<{ task: Task, imageUrl: string }> = ({ task, imageUrl }) => {
    return (
        <div className="task bg-white p-4 mb-4 rounded-lg shadow-sm" key={task.id}>
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{task.subject}</h3>
                <div className="flex items-center">
                    <img src={imageUrl} alt={task.assignedTo?.firstName} className="w-6 h-6 rounded-full" />
                    <span className="ml-2">{task.assignedTo?.firstName}</span>
                </div>
            </div>
            <p className="text-gray-700">{task.description}</p>
            {task.comments?.length > 2 &&
                <div className="text-gray-500 rounded text-xs">
                    <strong style={{ textDecoration: 'underline' }} >{task.comments.length - 2} more additional comments</strong>
                </div>
            }
            {task.comments?.slice(-2).map((comment, index) => (
                <div className={`comment mt-2 p-2 bg-gray-50 rounded-md ${index === 0 && task.comments.length >= 2 ? 'opacity-50' : ''}`} key={comment.id}>
                    <p className="comment__text">
                        <span className="comment__author font-semibold">{comment.author.firstName} {comment.author.lastName}</span> - {index === 0 && task.comments.length >= 2 ? `${comment.text.slice(0, 70)}...` : comment.text} <br />
                        <span className="text-xs text-gray-500">{comment.created}</span>
                        {comment.edited && <span className="comment__edited text-xs text-red-500 ml-2">Edited</span>}
                    </p>
                    {comment.edited && <div className="comment__edited-date text-xs text-gray-400 mt-1">Last edited: {comment.lastEdited}</div>}
                </div>
            ))}
        </div>
    );
};

const ReadOnlyKaizenBoard: React.FC = () => {
    const [columns, setColumns] = useState<Column[]>([]);
    const [userImages, setUserImages] = useState<{ [userId: string]: string }>({});

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await apiService.get('/kaizen/getTasks');
                const tasks = response;

                if (!Array.isArray(tasks)) {
                    console.error('Invalid tasks data:', tasks);
                    return;
                }

                const tasksWithImages = await Promise.all(tasks.map(async (task) => {
                    // Check if the image for the user already exists in the state
                    if (userImages[task.assignedTo?._id]) {
                        return { ...task, imageUrl: userImages[task.assignedTo?._id] };
                    } else {
                        // If not, fetch it from the API and add it to the state
                        try {
                            const data = await apiService.get(`/users/${task.assignedTo?._id}/image`);
                            const imageUrl = data.imageUrl;
                            console.log('User image URL:', imageUrl);
                            setUserImages(prevState => ({ ...prevState, [task.assignedTo?._id]: imageUrl }));
                            return { ...task, imageUrl };
                        }
                        catch (error) {
                            console.error('Error fetching user image:', error);
                            return { ...task, imageUrl: '' };
                        }
                    }
                }));

                const newTasks = tasksWithImages.filter((task: Task) => task.status === 'New');
                const progressTasks = tasksWithImages.filter((task: Task) => task.status === 'In Progress');
                const completedTasks = tasksWithImages.filter((task: Task) => task.status === 'Completed');
                const closedTasks = tasksWithImages.filter((task: Task) => task.status === 'Closed');
                const canceledTasks = tasksWithImages.filter((task: Task) => task.status === 'Canceled');

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

        // Fetch tasks immediately on component mount
        fetchTasks();

        // Set up an interval to fetch tasks every 7 seconds
        const intervalId = setInterval(fetchTasks, 7000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <div className="bg-green-600 text-white p-4 mb-4">
                Eye-share kaizenboard.
            </div>
            <div className="kaizen-board flex justify-between space-x-4 p-4">

                {columns.map(column => (
                    <div className="column bg-gray-100 p-4 rounded-lg shadow-md" key={column.title}>
                        <h2 className="text-xl font-bold mb-4">{column.title}</h2>
                        {column.tasks.map(task => (
                            <TaskComponent task={task} key={task.id} imageUrl={task.imageUrl} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReadOnlyKaizenBoard;