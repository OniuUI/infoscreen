import React, {useEffect, useState} from 'react';
import './css/taskboard.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './taskcard';
import {apiService} from "./api/apiservice";
import { v4 as uuidv4 } from 'uuid';
import { Comment } from './utils/types';

interface User {
    id: string;
    name: string;
}

interface Task {
    _id: { $oid: string };
    id: string;
    manager: User;
    subject: string;
    dueBy: string;
    description: string;
    assignedTo: User;
    status: string;
    comments: Comment[];
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
    manager: User;
    subject: string;
    dueBy: string;
    users: User[];
}

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    birthdate: string;
    imageUrl: string;
    coffee: number;
    soda: number;
    email?: string;
    password?: string;
    refreshToken?: string;
}

const Kaizen: React.FC = () => {
    const [newTask, setNewTask] = useState({ manager: '', subject: '', dueBy: '', description: '', assignedTo: '' });
    const [users, setUsers] = useState<User[]>([]);
    const [managersAndAdmins, setManagersAndAdmins] = useState<User[]>([]);

    useEffect(() => {
        const fetchManagersAndAdmins = async () => {
            try {
                const response = await apiService.get('/access/managers');
                if (Array.isArray(response.users)) {
                    setManagersAndAdmins(response.users);
                } else {
                    console.error('Invalid users data:', response.users);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchManagersAndAdmins();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiService.get('/users'); // Replace with your actual endpoint
                if (Array.isArray(response.users)) {
                    setUsers(response.users);
                } else {
                    console.error('Invalid users data:', response.users);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

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

        console.log('newTask.manager:', newTask.manager);
        console.log('newTask.assignedTo:', newTask.assignedTo);
        console.log('managersAndAdmins:', managersAndAdmins);
        console.log('users:', users);

        try {
            const managerUser = managersAndAdmins.find(user => user._id === newTask.manager);
            if (!managerUser) {
                console.error('User not found:', newTask.manager);
                return;
            }
            const assignedUser = users.find(user => user._id === newTask.assignedTo);
            if (!assignedUser) {
                console.error('User not found:', newTask.assignedTo);
                return;
            }
            const task = { ...newTask, manager: managerUser, assignedTo: assignedUser, id: uuidv4(), status: 'New' };
            const response = await apiService.post('/kaizen/createTask', task);
            console.log('Response:', response);
            if (response.success) {
                const newTaskWithId = response.task;
                setColumns(prevColumns => {
                    return prevColumns.map(column => {
                        if (column.title === 'New') {
                            return { ...column, tasks: [...column.tasks, newTaskWithId] };
                        }
                        return column;
                    });
                });
            }
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

    const handleDeleteTask = async (taskId: string) => {
        try {
            // Retrieve userIdent from local storage
            const userIdent = localStorage.getItem('userIdent');

            // Send a DELETE request to the backend
            await apiService.delete(`/kaizen/deleteTask/${taskId}?userIdent=${userIdent}`);

            // Create a new columns array with new objects and new tasks arrays
            const newColumns = columns.map(column => ({
                ...column,
                tasks: column.tasks.filter(task => task.id !== taskId),
            }));

            // Update the state
            setColumns(newColumns);
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    // Add a button for marking the task as complete and a dropdown for changing the status in the Card component
    const TaskComplete: React.FC<completeProps> = ({ task, manager, users }) => {
        const handleComplete = async () => {
            // Update the task's status to 'Completed'
            const updatedTask = { ...task, status: 'Completed' };

            // Update the task in the backend
            try {
                await apiService.put(`/kaizen/updateTask/${task.id}`, updatedTask);
            } catch (error) {
                console.error('Failed to update task:', error);
                return;
            }

            // Move the task to the 'Completed' column in the frontend
            setColumns(prevColumns => {
                const newColumns = prevColumns.map(column => {
                    if (column.title === task.status) {
                        // Remove the task from its current column
                        return { ...column, tasks: column.tasks.filter(t => t.id !== task.id) };
                    } else if (column.title === 'Completed') {
                        // Add the task to the 'Completed' column
                        return { ...column, tasks: [...column.tasks, updatedTask] };
                    }
                    return column;
                });
                return newColumns;
            });
        };

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

        // Update the task's status to match the destination column's title
        task.status = destinationColumn.title;

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
                        task && task.id ? (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        <Card
                                            task={task}
                                            manager={task.manager}
                                            subject={task.subject}
                                            dueBy={task.dueBy}
                                            users={users}
                                            handleDeleteTask={handleDeleteTask}
                                        />
                                        <TaskComplete task={task} manager={task.manager} subject={task.subject} dueBy={task.dueBy} users={users}/>
                                    </div>
                                )}
                            </Draggable>
                        ) : null
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
                            <select value={newTask.manager}
                                    onChange={e => setNewTask(prevTask => ({...prevTask, manager: e.target.value}))}
                                    required>
                                {managersAndAdmins.map(user => <option key={user._id}
                                                                       value={user._id}>{user.firstName} {user.lastName}</option>)}
                            </select>
                            <input type="text" value={newTask.subject}
                                   onChange={e => setNewTask(prevTask => ({...prevTask, subject: e.target.value}))}
                                   placeholder="Subject" required/>
                            <input type="date" value={newTask.dueBy}
                                   onChange={e => setNewTask(prevTask => ({...prevTask, dueBy: e.target.value}))}
                                   placeholder="Due By" required/>
                            <textarea value={newTask.description} onChange={e => setNewTask(prevTask => ({
                                ...prevTask,
                                description: e.target.value
                            }))} placeholder="Description" required/>
                            <select value={newTask.assignedTo}
                                    onChange={e => setNewTask(prevTask => ({...prevTask, assignedTo: e.target.value}))}
                                    required>
                                {users.map(user => <option key={user._id}
                                                           value={user._id}>{user.firstName} {user.lastName}</option>)}
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