import { useState, useEffect } from "react";

import { Dropdown, Table } from "flowbite-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import Calendar from "../../components/Calendar";

const data = [
  {
    name: "Jan",
    revenue: 4000,
    expense: 2400,
    amt: 2400,
  },
  {
    name: "Feb",
    revenue: 3000,
    expense: 1398,
    amt: 2210,
  },
  {
    name: "Mar",
    revenue: 2000,
    expense: 9800,
    amt: 2290,
  },
  {
    name: "Apr",
    revenue: 2780,
    expense: 3908,
    amt: 2000,
  },
  {
    name: "May",
    revenue: 1890,
    expense: 4800,
    amt: 2181,
  },
  {
    name: "Jun",
    revenue: 2390,
    expense: 3800,
    amt: 2500,
  },
  {
    name: "Jul",
    revenue: 3490,
    expense: 4300,
    amt: 2100,
  },
  {
    name: "Aug",
    revenue: 3490,
    expense: 1340,
    amt: 2100,
  },
  {
    name: "Sep",
    revenue: 3490,
    expense: 5160,
    amt: 2100,
  },
  {
    name: "Oct",
    revenue: 3490,
    expense: 8102,
    amt: 2100,
  },
  {
    name: "Nov",
    revenue: 3490,
    expense: 3012,
    amt: 2100,
  },
  {
    name: "Dec",
    revenue: 3490,
    expense: 1030,
    amt: 2100,
  },
];

export default function Analysis() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedView, setSelectedView] = useState("week");
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [statistics, setStatistics] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const getCurrentDateRange = (date) => {
    if (selectedView === "week") {
      const startOfWeek = date
        .startOf("week")
        .add(date.startOf("week").day() === 0 ? 1 : 0, "day");
      const endOfWeek = startOfWeek.add(6, "days");
      return `${startOfWeek.format("DD/MM/YYYY")} - ${endOfWeek.format(
        "DD/MM/YYYY"
      )}`;
    } else if (selectedView === "month") {
      return date.format("MM/YYYY");
    } else if (selectedView === "year") {
      return date.format("YYYY");
    }
    return "";
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowPicker(false);
    if (date) {
      setInputValue(getCurrentDateRange(date));
    }
  };

  const fetchData = async () => {
    if (selectedDate) {
      const year = selectedDate.year();
      const month = selectedDate.month() + 1;
      const day = selectedDate.date();

      try {
        if (selectedView === "week") {
          const startOfWeek = selectedDate.startOf("week").add(1, "day");
          const weekStatistics = [];

          for (let i = 0; i < 7; i++) {
            const currentDay = startOfWeek.add(i, "day");
            // const response = await api.get(
            //   `/statistics?year=${currentDay.year()}&month=${
            //     currentDay.month() + 1
            //   }&day=${currentDay.date()}`
            // );
            // weekStatistics.push(...response.data.data);
          }

          setStatistics(weekStatistics);

          const total = weekStatistics.reduce((sum, stat) => {
            return sum + stat.total_revenue;
          }, 0);
          setTotalRevenue(total);
        } else if (selectedView === "month") {
          // const response = await api.get(
          //   `/statistics?year=${year}&month=${month}`
          // );
          // setStatistics(response.data.data);
          // const total = response.data.data.reduce((sum, stat) => {
          //   return sum + stat.total_revenue;
          // }, 0);
          // setTotalRevenue(total);
        } else if (selectedView === "year") {
          // const response = await api.get(`/statistics?year=${year}`);
          // setStatistics(response.data.data);
          // const total = response.data.data.reduce((sum, stat) => {
          //   return sum + stat.total_revenue;
          // }, 0);
          // setTotalRevenue(total);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleViewChange = (value) => {
    setSelectedView(value);
    setInputValue(getCurrentDateRange(dayjs()));
    fetchData();
  };

  useEffect(() => {
    const currentDate = dayjs();
    setSelectedDate(currentDate);
    setInputValue(getCurrentDateRange(currentDate));
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedView) {
      fetchData();
    }
  }, [selectedView]);

  useEffect(() => {
    setInputValue(getCurrentDateRange(dayjs()));
  }, [selectedView]);

  const handleExportReport = () => {
    if (!selectedDate) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bảng Báo Cáo");

    worksheet.mergeCells("A2:D2");
    const reportCell2 = worksheet.getCell("A2");
    if (selectedView === "month") {
      reportCell2.value =
        "Tháng: " + (selectedDate?.month() + 1) + "/" + selectedDate?.year();
    } else if (selectedView === "year") {
      reportCell2.value = "Năm: " + selectedDate?.year();
    } else {
      reportCell2.value = "Tuần: " + getCurrentDateRange(selectedDate);
    }
    reportCell2.font = { bold: true };
    reportCell2.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.getRow(3).values = ["STT", "Ngày", "Số đơn hàng", "Doanh thu"];
    const headerRow = worksheet.getRow(3);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFCCEEFF" },
      };
      cell.alignment = { horizontal: "left" };
      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
      };
    });

    statistics.forEach((stat, index) => {
      worksheet.addRow([
        index + 1,
        `${stat.day}/${stat.month}/${stat.year}`,
        stat.total_order,
        stat.total_revenue,
      ]);
    });

    worksheet.columns = [
      { key: "no", width: 5 },
      { key: "date", width: 20 },
      { key: "total_order", width: 20 },
      { key: "total_revenue", width: 25 },
    ];

    const fileName = `Báo_Cáo_Doanh_Thu_${dayjs().format("YYYYMMDD")}.xlsx`;
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), fileName);
    });
  };

  return (
    <div className="p-10 w-full">
      <p className="font-extrabold text-xl">Analysis</p>
      <div className="bg-white rounded-lg mt-10 p-6 shadow-md w-full flex flex-col gap-y-5">
        <div className="flex flex-row gap-x-3 items-center">
          <div>
            <input
              onClick={() => setShowPicker(true)}
              value={inputValue}
              placeholder="Chọn ngày"
              className="w-full font-semibold font-manrope px-5 py-3 focus:outline-none rounded-lg bg-[#F8F8F8] text-[#0a0a0a] text-sm"
              readOnly
            />
            {showPicker && (
              <Calendar
                setNewTime={handleDateChange}
                value={selectedDate}
                timeOption={selectedView}
                handlerSetNewTime={handleDateChange}
              />
            )}
          </div>
          <select
            value={selectedView}
            onChange={(e) => handleViewChange(e.target.value)}
            className="w-fit h-fit font-semibold font-manrope px-5 py-3 border-none focus:ring-0 focus:outline-none rounded-lg bg-[#F8F8F8] text-[#0a0a0a] text-sm"
            required
          >
            <option value="week" className="font-medium font-manrope text-sm">
              Week
            </option>
            <option value="month" className="font-medium font-manrope text-sm">
              Month
            </option>
            <option value="year" className="font-medium font-manrope text-sm">
              Year
            </option>
          </select>
          <button
            onClick={handleExportReport}
            className="px-6 py-3 h-full rounded-lg bg-[#0A0A0A] text-white text-sm font-extrabold ml-4"
          >
            Export Report
          </button>
        </div>
        <div className="flex justify-between">
          <Table hoverable>
            <Table.Head className="normal-case text-sm">
              <Table.HeadCell className="w-40">No</Table.HeadCell>
              <Table.HeadCell className="w-40">Date</Table.HeadCell>
              <Table.HeadCell className="w-40">Total Order</Table.HeadCell>
              <Table.HeadCell className="w-40">Revenue</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y"></Table.Body>
          </Table>
          <Table>
            <Table.Head className="normal-case text-sm">
              <Table.HeadCell>Information</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <div className="w-[400px] flex justify-between font-semibold">
                    <p>Total Orders</p>
                    <p>12</p>
                  </div>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <div className="w-[400px] flex justify-between font-semibold">
                    <p>Total Revenue</p>
                    <p>12</p>
                  </div>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
        <div className="bg-white rounded-lg flex flex-col gap-y-2">
          <p className="font-bold">Revenue</p>
          <p className="text-2xl font-bold">$1,234,567</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={data}
              className="font-semibold text-xs"
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorExpense)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
