interface ProgressProps {
    totalTasks: number;
    completedTasks: number;
}

const ProgressComponent: React.FC<ProgressProps> = ({ totalTasks, completedTasks }) => {
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <div>
            <div className="text-sm font-semibold mb-2">
                {completedTasks}/{totalTasks} tasks completed
            </div>
            <div className="w-full bg-gray-300 rounded h-5">
                <div style={{ width: `${progressPercentage}%` }} className="bg-green-500 h-5 rounded"></div>
            </div>
        </div>
    );
};

export default ProgressComponent;