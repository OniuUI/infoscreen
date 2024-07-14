import React, {useEffect, useState} from 'react';
import './css/taskboard.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './taskcard';
import {apiService} from "./api/apiservice";
import { v4 as uuidv4 } from 'uuid';
import {User, Task, Comment, Column } from './utils/types';
import './css/kaizen.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons';
import KaizenNavbar from "./kaizennav";
import {fetchCategories} from "../service/CategoryService";

interface TaskProps {
    title: string;
    tasks: Task[];
    users: User[];
}

interface completeProps {
    task: Task;
    manager: User;
    subject: string;
    dueBy: string;
    users: User[];
}


const Kaizen: React.FC = () => {
    const [newTask, setNewTask] = useState({ manager: '', subject: '', dueBy: '', description: '', assignedTo: '' });
    const [users, setUsers] = useState<User[]>([]);
    const [managersAndAdmins, setManagersAndAdmins] = useState<User[]>([]);
    const [userRole, setUserRole] = useState('');
    const [userIdent, setUserIdent] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [assignToUser, setAssignToUser] = useState(false);
    const [categories, setCategories] = useState<Column[]>([]);

    useEffect(() => {
        const loadCategories = async () => {
            const fetchedCategories = await fetchCategories();
            // Sort categories by their 'order' property
            const sortedCategories = fetchedCategories.sort((a: any, b: any) => a.order - b.order);
            setCategories(sortedCategories);
        };
        loadCategories();
    }, []);

    useEffect(() => {
        // Retrieve userIdent from local storage
        const ident = localStorage.getItem('userIdent');

        // Set the userIdent state
        setUserIdent(ident || '');
    }, []);

    useEffect(() => {
        // Other fetch functions...

        // Retrieve userRole from local storage
        const role = localStorage.getItem('userRole');

        // Set the userRole state
        setUserRole(role || '');
    }, []);

    useEffect(() => {
        const fetchManagersAndAdmins = async () => {
            try {
                const response = await apiService.get('/access/managers');
                if (Array.isArray(response.users)) {
                    setManagersAndAdmins(response.users);
                    if (response.users.length > 0) {
                        setNewTask(prevTask => ({ ...prevTask, manager: response.users[0]._id }));
                    }
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
                    if (response.users.length > 0) {
                        setNewTask(prevTask => ({ ...prevTask, assignedTo: response.users[0]._id }));
                    }
                } else {
                    console.error('Invalid users data:', response.users);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);
/*
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
                    { id: "1", title: 'New', tasks: newTasks },
                    { id: "2", title: 'In Progress', tasks: progressTasks },
                    { id: "3", title: 'Completed', tasks: completedTasks },
                    { id: "4", title: 'Closed', tasks: closedTasks },
                    { id: "5", title: 'Canceled', tasks: canceledTasks },
                ]);
            } catch (error) {
                console.error('Error fetching task data:', error);
            }
        };

        fetchTasks();
        //const intervalId = setInterval(fetchTasks, 30000); // Fetch every 30 seconds

        return; // () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);
*/
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Fetch categories
                const fetchedCategories = await fetchCategories();
                const categoriesWithEmptyTasks = fetchedCategories.map((category: {id: string, title: string, tasks: Task[] }) => ({
                    ...category,
                    tasks: [],
                }));

                // Fetch tasks
                const response = await apiService.get('/kaizen/getTasks');
                const tasks = response;

                if (!Array.isArray(tasks)) {
                    console.error('Invalid tasks data:', tasks);
                    return;
                }

                // Distribute tasks among categories based on their status
                const updatedCategories = categoriesWithEmptyTasks.map((category: {id: string,  title: string, tasks: Task[] }) => {
                    const filteredTasks = tasks.filter((task: Task) => task.status === category.title);
                    return { ...category, tasks: filteredTasks };
                });

                // Update the columns state with categories that now include tasks
                setColumns(updatedCategories);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchTasks();
    }, []);


    const handleNewTaskSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const blankUser = { _id: '', firstName: '', lastName: '', email: '', birthdate: '', imageUrl: '', coffee: 0, soda: 0, password: '', refreshToken: '', role: ''};


        try {
            const managerUser = managersAndAdmins.find(user => user._id === newTask.manager);
            if (!managerUser) {
                console.error('User not found:', newTask.manager);
                return;
            }
            let assignedUser: User = blankUser;
            if (assignToUser) {
                const foundUser = users.find(user => user._id === newTask.assignedTo);
                if (!foundUser) {
                    console.error('User not found:', newTask.assignedTo);
                    return;
                }
                assignedUser = foundUser; // Set assignedUser to the user object instead of the ID
            }
            const task = { ...newTask, manager: managerUser, assignedTo: assignedUser, id: uuidv4(), status: 'New' }; // Set manager to the user object instead of the ID
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
                await apiService.put(`/kaizen/updateTask/${task.id}?userIdent=${userIdent}&role=${userRole}`, updatedTask);
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
            <button className="complete-task-button" onClick={handleComplete}>Complete Task</button>
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

    const [columns, setColumns] = useState<Column[]>([]);

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
        //const task = sourceColumn.tasks.find((task: Task) => task.id === draggableId);
        console.log(draggableId)
        const response = await apiService.get(`/kaizen/tasks/${draggableId}`);
        const task = response.task;

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
            console.log('Checking ident:', userIdent);
            await apiService.put(`/kaizen/updateTask/${draggableId}?userIdent=${userIdent}&role=${userRole}`, task);
        } catch (error) {
            console.error('Failed to update task:', error);
        }

        // Update the state
        setColumns(newColumns);
    };

//TODO: Move the TaskColumn component to a separate file

    const TaskColumn: React.FC<TaskProps> = ({ title, tasks, users }) => (
        <Droppable droppableId={title}>
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="task-column">
                    <h2 className="text-white">{title}</h2>
                    {tasks.map((task: Task, index: number) => (
                        task && task.id ? (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="card">
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
        <>
            <KaizenNavbar />
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="bg-gray-900 text-blue-400 task-board" >
                {columns.map((column, index) => (
                    <div key={index}>
                        <TaskColumn title={column.title} tasks={column.tasks} users={users} />
                        {column.title === 'New' && (userRole === 'admin' || userRole === 'manager') && (
                            <>
                            {showForm && (
                                <form onSubmit={handleNewTaskSubmit} className="task-form">
                                    <select value={newTask.manager}
                                            onChange={e => setNewTask(prevTask => ({
                                                ...prevTask,
                                                manager: e.target.value
                                            }))}
                                            required>
                                        {managersAndAdmins.map(user => <option key={user._id}
                                                                               value={user._id}>{user.firstName} {user.lastName}</option>)}
                                    </select>
                                    <input type="text" value={newTask.subject}
                                           onChange={e => setNewTask(prevTask => ({
                                               ...prevTask,
                                               subject: e.target.value
                                           }))}
                                           placeholder="Subject" required
                                    />
                                    <input type="date" value={newTask.dueBy}
                                           onChange={e => setNewTask(prevTask => ({
                                               ...prevTask,
                                               dueBy: e.target.value
                                           }))}
                                           placeholder="Due By" required
                                    />
                                    <textarea value={newTask.description} onChange={e => setNewTask(prevTask => ({
                                        ...prevTask,
                                        description: e.target.value
                                    }))} placeholder="Description" required
                                    />
                                    <div className="checkbox-container">
                                        <label className="assign-label">Assign to user</label>
                                        <input type="checkbox" checked={assignToUser}
                                               onChange={e => setAssignToUser(e.target.checked)}
                                               className="assign-checkbox"/>
                                    </div>
                                    {assignToUser && (
                                        <select value={newTask.assignedTo}
                                                onChange={e => setNewTask(prevTask => ({
                                                    ...prevTask,
                                                    assignedTo: e.target.value
                                                }))}
                                                required>
                                            {users.map(user => <option key={user._id}
                                                                       value={user._id}>{user.firstName} {user.lastName}</option>)}
                                        </select>
                                    )}
                                    <button type="submit">Create Task</button>
                                </form>
                            )}
                                <FontAwesomeIcon icon={showForm ? faMinus : faPlus}
                                                 className={`plus-icon ${showForm ? 'minus-icon' : ''}`}
                                                 onClick={() => setShowForm(!showForm)} />
                            </>
                        )}
                    </div>
                ))}
            </div>
        </DragDropContext>
        </>
    );
};

export default Kaizen;