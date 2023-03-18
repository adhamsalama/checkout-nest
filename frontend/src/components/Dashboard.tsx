import { Route, Routes } from "react-router";
import { HTTPMethod, io } from "../api";
import LineChart from "../components/LineChart";
import BarChart from "../components/PieChart";
import Login from "../components/SignIn";
function Dashboard() {
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
  console.log({ dataaa: data });

  function getMonthsData(year: number) {
    const res = io(
      `http://localhost:4000/expenses/statistics/yearly/${year}`,
      HTTPMethod.GET,
      null,
      { Authorization: `Bearer ${localStorage.getItem("token")}` }
    );
    return res;
  }
  const { data: janData } = io(
    `http://localhost:4000/expenses/statistics/${2023}/${1}`,
    HTTPMethod.GET,
    null,
    { Authorization: `Bearer ${localStorage.getItem("token")}` }
  ) as { data?: { _id: number; sum: number }[] };
  const { data: febData } = io(
    `http://localhost:4000/expenses/statistics/${2023}/${2}`,
    HTTPMethod.GET,
    null,
    { Authorization: `Bearer ${localStorage.getItem("token")}` }
  ) as { data?: { _id: number; sum: number }[] };

  const { data: marchData } = io(
    `http://localhost:4000/expenses/statistics/${2023}/${3}`,
    HTTPMethod.GET,
    null,
    { Authorization: `Bearer ${localStorage.getItem("token")}` }
  ) as { data?: { _id: number; sum: number }[] };

  const { data: data2023 } = getMonthsData(2023) as {
    data: { _id: number; sum: number }[];
  };
  const { data: data2022 } = getMonthsData(2022) as {
    data: { _id: number; sum: number }[];
  };
  const { data: data2021 } = getMonthsData(2021) as {
    data: { _id: number; sum: number }[];
  };
  const { data: data2020 } = getMonthsData(2020) as {
    data: { _id: number; sum: number }[];
  };
  if (!localStorage.getItem("token")) {
    return <h1>Not logged in</h1>;
  }
  return (
    <>
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
          label="Expenses per month"
          labels={months}
          datasets={[
            {
              label: "2023",
              data: data2023?.map((i) => i.sum),
            },
            {
              label: "2022",
              data: data2022?.map((i) => i.sum),
            },
            {
              label: "2021",
              data: data2021?.map((i) => i.sum),
            },
            {
              label: "2020",
              data: data2020?.map((i) => i.sum),
            },
          ]}
        />
        <LineChart
          label="Expenses per day"
          labels={((n: any) => {
            return [...Array(n).keys()];
          })(31)}
          datasets={[
            {
              label: "January",
              data: janData?.map((i) => i.sum) ?? [],
            },
            {
              label: "February",
              data: febData?.map((i) => i.sum) ?? [],
            },
            {
              label: "March",
              data: marchData?.map((i) => i.sum) ?? [],
            },
          ]}
        />
      </div>
    </>
  );
}

export default Dashboard;
