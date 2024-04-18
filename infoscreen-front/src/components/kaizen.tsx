import React from 'react';
import './css/taskboard.css';

interface TaskProps {
  title: string;
  tasks: string[];
}

const TaskColumn = ({ title, tasks }: TaskProps) => (
  <div className="task-column">
    <h2>{title}</h2>
    {tasks.map((task: string, index: number) => (
      <div key={index} className="task">
        {task}
      </div>
    ))}
  </div>
);

const Kaizen = () => {
  const newTasks: string[] = ['Task 1', 'Task 2'];
  const inProgressTasks: string[] = ['Task 3'];
  const completedTasks: string[] = ['Task 4'];
  const closedTasks: string[] = [];
  const canceledTasks: string[] = ['Task 5'];

  return (
    <div className="task-board">
      <TaskColumn title="New" tasks={newTasks} />
      <TaskColumn title="In Progress" tasks={inProgressTasks} />
      <TaskColumn title="Completed" tasks={completedTasks} />
      <TaskColumn title="Closed" tasks={closedTasks} />
      <TaskColumn title="Canceled" tasks={canceledTasks} />
    </div>
  );
};

export default Kaizen;