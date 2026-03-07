import { useAppContext } from '@/context/app-context';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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
  const isAnimationActive = true;
  const getData = () => {
    const data: DataItem[] = [];

    // this loop is used to get the data for the last 7 days
    // we start from the last day and go back to the first day
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

      data.push({
        name: dayName,
        Intake: intake,
        Burn: burn,
        date: dateString
      });
    }

    console.log({ data });

    return data;
  };
  const data = getData();

  return (
    <div className="w-full mt-4">
      <AreaChart responsive data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" niceTicks="snap125" />
        <YAxis width="auto" niceTicks="snap125" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="Intake"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <Area type="monotone" dataKey="Burn" stroke="#82ca9d" fill="#82ca9d" />
        <Area
          type="monotone"
          dataKey="Difference"
          stroke="#ffc658"
          fill="#ffc658"
        />
      </AreaChart>
    </div>
  );
};

export default CaloriesChart;
