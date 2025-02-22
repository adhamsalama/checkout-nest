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
      `${config.baseUrl}/expenses/statistics/yearly/${year}`,
      HTTPMethod.GET,
      null,
      { Authorization: `Bearer ${localStorage.getItem("token")}` }
    );
    return res;
  }
  // const { data: currentYearCurrentMonth } = getMonthData(
  //   new Date().getFullYear(),
  //   new Date().getMonth() + 1
  // ) as { data: { _id: number; sum: number }[] };
  // const { data: previousYearCurrentMonth } = getMonthData(
  //   new Date().getFullYear() - 1,
  //   new Date().getMonth() + 1
  // ) as { data: { _id: number; sum: number }[] };

  const { data } = io(
    `${config.baseUrl}/expenses/statistics`,
    HTTPMethod.GET,
    null,
    { Authorization: `Bearer ${localStorage.getItem("token")}` }
  ) as {
    data: {
      tag: string;
      count: number;
      max: number;
      min: number;
      avg: number;
      sum: number;
    }[];
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
    let { data: yearData } = getYearData(new Date().getFullYear() - i) as {
      data?: { month: number; sum: number }[];
    };
    yearData = yearData?.map(i => {
      return {
        ...i,
        sum: -i.sum
      }
    })
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
    if (month == 0) {
      continue;
    }
    const { data: monthData } = getMonthData(year, month) as {
      data?: { _id: number; sum: number }[];
    };
    monthsData.push({
      label: months[month - 1],
      data: [0].concat(monthData?.map((y) => -y.sum) ?? []) ?? [],
    });
  }
  // if (!localStorage.getItem("token")) {
  //   return <h1>Not logged in</h1>;
  // }
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        alignContent: "center",
        alignItems: "center",
        margin: "auto",
      }}
    >
      <div
        style={{
          width: "55%",
          height: "55%",
          alignContent: "center",
          alignItems: "center",
          margin: "auto",
        }}
      >
        <BarChart
          label="Expenses by tags"
          labels={data?.map((item) => item.tag) ?? []}
          data={data?.map((item) => item.sum) ?? []}
        />
      </div>

      <LineChart
        label={`Expenses per month for last ${yearsData.length} years`}
        labels={months}
        datasets={yearsData}
      />
      <LineChart
        label={`Expenses per day for last ${monthsData.length} months`}
        labels={((n: any) => {
          return [...Array(n).keys()];
        })(32)}
        datasets={monthsData}
      />
    </div>
  );
}

export default Dashboard;
