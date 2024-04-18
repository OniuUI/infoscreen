import React, {useState} from 'react';
import './css/taskboard.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './taskcard';

interface User {
    id: string;
    name: string;
}

interface Task {
    id: string;
    manager: string;
    subject: string;
    dueBy: string;
    description: string;
    assignedTo: User;
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

const TaskColumn: React.FC<TaskProps> = ({ title, tasks, users }) => (
    <Droppable droppableId={title}>
        {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="task-column">
                <h2>{title}</h2>
                {tasks.map((task: Task, index: number) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <Card
                                    task={task.description}
                                    manager={task.manager}
                                    subject={task.subject}
                                    dueBy={task.dueBy}
                                    users={users}
                                />
                            </div>
                        )}
                    </Draggable>
                ))}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
);



const Kaizen: React.FC = () => {
    const users: User[] = [
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
        // Add more users here
    ];


    const newTasks: Task[] = [
        { id: '1', manager: 'Manager 1', subject: 'Subject 1', dueBy: '2022-12-31', description: 'Description 1', assignedTo: users[0] },
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

    const onDragEnd = (result: any) => {
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

        // Update the state
        setColumns(newColumns);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="task-board">
                <TaskColumn title="New" tasks={newTasks} users={users} />
                <TaskColumn title="In Progress" tasks={progressTasks} users={users} />
                <TaskColumn title="Completed" tasks={completedTasks} users={users} />
                <TaskColumn title="Closed" tasks={closedTasks} users={users} />
                <TaskColumn title="Canceled" tasks={canceledTasks} users={users} />
            </div>
        </DragDropContext>
    );
};

export default Kaizen;