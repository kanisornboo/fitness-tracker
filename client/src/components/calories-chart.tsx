import { useAppContext } from '@/context/app-context';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface DataItem {
  name: string;
  Intake: number;
  Burn: number;
  date: string;
}

const CaloriesChart = () => {
  const { allActivityLogs, allFoodLogs } = useAppContext();

  const getData = () => {
    const data: DataItem[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      const dailyFood = allFoodLogs.filter(
        (log) => log.createdAt?.split('T')[0] === dateString
      );
      const dailyActivity = allActivityLogs.filter(
        (log) => log.createdAt?.split('T')[0] === dateString
      );

      const intake = dailyFood.reduce((sum, item) => sum + item.calories, 0);
      const burn = dailyActivity.reduce(
        (sum, item) => sum + (item.calories || 0),
        0
      );

      data.push({ name: dayName, Intake: intake, Burn: burn, date: dateString });
    }

    return data;
  };

  const data = getData();

  return (
    <div className="w-full mt-4">
      <AreaChart responsive data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis width={60} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="Intake"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <Area type="monotone" dataKey="Burn" stroke="#82ca9d" fill="#82ca9d" />
      </AreaChart>
    </div>
  );
};

export default CaloriesChart;
