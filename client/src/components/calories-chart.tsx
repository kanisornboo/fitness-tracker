import { useAppContext } from '@/context/app-context';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
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
      <div
        role="img"
        aria-label="Calories chart: calorie intake vs calories burned over the last 7 days">
        <AreaChart responsive data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis width={60} />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="Intake"
            name="Calories Intake"
            stroke="#8884d8"
            fill="#8884d8"
            strokeDasharray="0"
          />
          <Area
            type="monotone"
            dataKey="Burn"
            name="Calories Burned"
            stroke="#22c55e"
            fill="#22c55e"
            strokeDasharray="4 2"
          />
        </AreaChart>
      </div>

      {/* Screen-reader accessible data table */}
      <table className="sr-only">
        <caption>Calories intake and burned over the last 7 days</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Calories Intake (kcal)</th>
            <th scope="col">Calories Burned (kcal)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.date}>
              <td>{row.name}</td>
              <td>{row.Intake}</td>
              <td>{row.Burn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CaloriesChart;
