import { HTTPMethod, io } from "../api";
import LineChart from "../components/LineChart";
import BarChart from "../components/PieChart";
import { config } from "../../config";
function Dashboard() {
  function getMonthData(year: number, month: number) {
    return io(
      config.baseUrl + `/expenses/statistics/${year}/${month}`,
      HTTPMethod.GET,
      null,
      {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }
    );
  }
  function getYearData(year: number) {
    const res = io(
      `http://localhost:4000/expenses/statistics/yearly/${year}`,
      HTTPMethod.GET,
      null,
      { Authorization: `Bearer ${localStorage.getItem("token")}` }
    );
    return res;
  }
  const { data: currentYearCurrentMonth } = getMonthData(
    new Date().getFullYear(),
    new Date().getMonth() + 1
  ) as { data: { _id: number; sum: number }[] };
  const { data: previousYearCurrentMonth } = getMonthData(
    new Date().getFullYear() - 1,
    new Date().getMonth() + 1
  ) as { data: { _id: number; sum: number }[] };

  const { data } = io(
    "http://localhost:4000/expenses/statistics",
    HTTPMethod.GET,
    null,
    { Authorization: `Bearer ${localStorage.getItem("token")}` }
  ) as {
    data: any[];
  };
  const months = [
    // "0",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const yearsData: { label: string; data: number[] }[] = [];
  for (let i = 0; i < 3; i++) {
    const { data: yearData } = getYearData(new Date().getFullYear() - i) as {
      data?: { _id: number; sum: number }[];
    };
    yearsData.push({
      label: (new Date().getFullYear() - i).toString(),
      data: yearData?.map((y) => y.sum) ?? [],
    });
  }
  const monthsData: { label: string; data: number[] }[] = [];
  for (let i = 0; i < 2; i++) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1 - i;
    console.log({ month });

    const { data: monthData } = getMonthData(year, month) as {
      data?: { _id: number; sum: number }[];
    };
    monthsData.push({
      label: months[month - 1],
      data: [0].concat(monthData?.map((y) => y.sum) ?? []) ?? [],
    });
  }
  if (!localStorage.getItem("token")) {
    return <h1>Not logged in</h1>;
  }
  return (
    <div
      style={{
        width: "50%",
        height: "50%",
        alignContent: "center",
        alignItems: "center",
        margin: "auto",
      }}
    >
      <BarChart
        label="Expenses by tags"
        labels={data?.map((item) => item._id) ?? []}
        data={data?.map((item) => item.totalPrice) ?? []}
      />
      <LineChart
        label={`Expenses per month for last ${yearsData.length} years`}
        labels={months}
        datasets={yearsData}
      />
      <LineChart
        label={`Expenses per day for last ${monthsData.length} months`}
        labels={((n: any) => {
          return [...Array(n).keys()];
        })(31)}
        datasets={monthsData}
      />
    </div>
  );
}

export default Dashboard;
