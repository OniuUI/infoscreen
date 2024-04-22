// src/components/statistics.tsx
import './css/statistics.css';
import { Chart, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

const Statistics: React.FC = () => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: '# of Kaizens solved',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: '#241f85',
        borderColor: '#0f0d0d',
        borderWidth: 1,
      },
    ],
  };
  Chart.register(...registerables);

  return (
    <div className="stats-container">
      <h1 className="title">Kaizens solved per month</h1>
      <Bar data={chartData} options={{}} />
    </div>
  );
};

export default Statistics;
