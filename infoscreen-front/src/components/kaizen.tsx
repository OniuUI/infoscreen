import React, {useEffect, useState} from 'react';
import './css/taskboard.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './taskcard';
import {apiService} from "./api/apiservice";

interface User {
    id: string;
    name: string;
}

interface Task {
    _id: { $oid: string };
    id: string;
    manager: string;
    subject: string;
    dueBy: string;
    description: string;
    assignedTo: User;
    status: string;
    comments: string[];
}

interface TaskProps {
    title: string;
    tasks: Task[];
    users: User[];
}

interface Column {
    title: string;
    tasks: Task[];
}

interface completeProps {
    task: Task;
    manager: string;
    subject: string;
    dueBy: string;
    users: User[];
}



const Kaizen: React.FC = () => {
    const [newTask, setNewTask] = useState({ manager: '', subject: '', dueBy: '', description: '', assignedTo: '' });
    const users: User[] = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
        // Add more users here
    ];

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await apiService.get('/kaizen/getTasks');

                const tasks = response;

                // Check if tasks is defined and is an array
                if (!Array.isArray(tasks)) {
                    console.error('Invalid tasks data:', tasks);
                    return;
                }

                // Distribute the tasks among the columns based on their status
                const newTasks = tasks.filter((task: Task) => task.status === 'New');
                const progressTasks = tasks.filter((task: Task) => task.status === 'In Progress');
                const completedTasks = tasks.filter((task: Task) => task.status === 'Completed');
                const closedTasks = tasks.filter((task: Task) => task.status === 'Closed');
                const canceledTasks = tasks.filter((task: Task) => task.status === 'Canceled');

                // Update the columns state
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
        //const intervalId = setInterval(fetchTasks, 30000); // Fetch every 30 seconds

        return; // () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);

    const handleNewTaskSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            // Find the user object
            const assignedUser = users.find(user => user.id === newTask.assignedTo);
            if (!assignedUser) {
                console.error('User not found:', newTask.assignedTo);
                return;
            }
            // Create the new task with the user object and a 'New' status
            const task = { ...newTask, assignedTo: assignedUser, id: Math.random().toString(), status: 'New' };
            // Send a POST request to the API endpoint
            const response = await apiService.post('/kaizen/createTask', task);
            // If the request is successful, add the new task to the 'New' column
            if (response.data.success) {
                const newTaskWithId = response.data.task; // assuming the server returns the new task in the response
                setColumns(prevColumns => {
                    const newColumns = [...prevColumns];
                    const newColumn = newColumns.find(column => column.title === 'New');
                    if (newColumn) {
                        newColumn.tasks = [...newColumn.tasks, newTaskWithId];
                    }
                    return newColumns;
                });
            }
            // Clear the form
            setNewTask({ manager: '', subject: '', dueBy: '', description: '', assignedTo: '' });
        } catch (error) {
            console.error('Failed to create new task:', error);
        }
    };

    const handleStatusChange = async (task: Task, event: React.ChangeEvent<HTMLSelectElement>) => {
        try {
            await apiService.put(`/kaizen/updateTask/${task.id}`, { ...task, status: event.target.value });
            // Add code here to move the task to the corresponding column in the frontend
        } catch (error) {
            console.error('Failed to change task status:', error);
        }
    };


    // Add a button for marking the task as complete and a dropdown for changing the status in the Card component
    const TaskComplete: React.FC<completeProps> = ({ task, manager, subject, dueBy, users }) => {
        const handleComplete = async () => {
            try {
                // Update the task status in the backend
                const response = await apiService.put(`/kaizen/updateTask/${task.id}`, { ...task, status: 'Completed' });
                if (response.data.success) {
                    // Move the task to the 'Completed' column in the frontend
                    setColumns(prevColumns => {
                        const newColumns = prevColumns.map(column => {
                            if (column.title === task.status) {
                                // Remove the task from its current column
                                return { ...column, tasks: column.tasks.filter(t => t.id !== task.id) };
                            } else if (column.title === 'Completed') {
                                // Add the task to the 'Completed' column
                                return { ...column, tasks: [...column.tasks, { ...task, status: 'Completed' }] };
                            } else {
                                return column;
                            }
                        });
                        return newColumns;
                    });
                } else {
                    console.error('Failed to update task status in the backend:', response.data.message);
                }
            } catch (error) {
                console.error('Failed to mark task as complete:', error);
            }
        };
        // Return a JSX element
        return (
            <button onClick={handleComplete}>Complete Task</button>
        );
    };

    const newTasks: Task[] = [
    ];
    const progressTasks: Task[] = [
        ];
    const completedTasks: Task[] = [
        ];
    const closedTasks: Task[] = [
        ];
    const canceledTasks: Task[] = [
        ];

    const [columns, setColumns] = useState<Column[]>([
        { title: 'New', tasks: newTasks },
        { title: 'In Progress', tasks: progressTasks },
        { title: 'Completed', tasks: completedTasks },
        { title: 'Closed', tasks: closedTasks },
        { title: 'Canceled', tasks: canceledTasks },
    ]);

    // Repeat for inProgressTasks, completedTasks, closedTasks, canceledTasks

    const onDragEnd = async (result: any) => {
        const { destination, source, draggableId } = result;

        // If there's no destination (i.e., the user cancelled the drag), do nothing
        if (!destination) {
            return;
        }

        // If the source and destination are the same, do nothing
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Create a new columns array with new objects and new tasks arrays
        const newColumns = columns.map(column => ({
            ...column,
            tasks: [...column.tasks],
        }));

        // Find the source and destination columns
        const sourceColumn = newColumns.find((column: Column) => column.title === source.droppableId);
        const destinationColumn = newColumns.find((column: Column) => column.title === destination.droppableId);

        if (!sourceColumn || !destinationColumn) {
            return;
        }

        // Find the task
        const task = sourceColumn.tasks.find((task: Task) => task.id === draggableId);

        if (!task) {
            return;
        }

        // Remove the task from the source column
        sourceColumn.tasks = sourceColumn.tasks.filter((task: Task) => task.id !== draggableId);

        // Add the task to the destination column
        destinationColumn.tasks.splice(destination.index, 0, task);

        // Update the task in the backend
        try {
            await apiService.put(`/kaizen/updateTask/${draggableId}`, task);
        } catch (error) {
            console.error('Failed to update task:', error);
        }

        // Update the state
        setColumns(newColumns);
    };

    const TaskColumn: React.FC<TaskProps> = ({ title, tasks, users }) => (
        <Droppable droppableId={title}>
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="task-column">
                    <h2>{title}</h2>
                    {tasks.map((task: Task, index: number) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <Card
                                        task={task.description}
                                        manager={task.manager}
                                        subject={task.subject}
                                        dueBy={task.dueBy}
                                        users={users}
                                    />
                                    <TaskComplete task={task} manager={task.manager} subject={task.subject} dueBy={task.dueBy} users={users}/>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="task-board">
            {columns.map((column, index) => (
                <div key={index}>
                    <TaskColumn title={column.title} tasks={column.tasks} users={users} />
                    {column.title === 'New' && (
                        <form onSubmit={handleNewTaskSubmit}>
                            <input type="text" value={newTask.manager} onChange={e => setNewTask(prevTask => ({ ...prevTask, manager: e.target.value }))} placeholder="Manager" required />
                            <input type="text" value={newTask.subject} onChange={e => setNewTask(prevTask => ({ ...prevTask, subject: e.target.value }))} placeholder="Subject" required />
                            <input type="date" value={newTask.dueBy} onChange={e => setNewTask(prevTask => ({ ...prevTask, dueBy: e.target.value }))} placeholder="Due By" required />
                            <textarea value={newTask.description} onChange={e => setNewTask(prevTask => ({ ...prevTask, description: e.target.value }))} placeholder="Description" required />
                            <select value={newTask.assignedTo} onChange={e => setNewTask(prevTask => ({ ...prevTask, assignedTo: e.target.value }))} required>
                                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                            </select>
                            <button type="submit">Create Task</button>
                        </form>
                    )}
                </div>
            ))}
            </div>
        </DragDropContext>
    );
};

export default Kaizen;