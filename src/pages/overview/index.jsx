import { 
  FaUsers, 
  FaCalendarCheck, 
  FaFlask, 
  FaUserMd,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import {  useOverviewQuery } from "../../api/overview";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Overview = () => {
  const {data:dashboard} = useOverviewQuery()
  const cardData = dashboard?.cards;
  const recentAppointments = dashboard?.weeklyappointments?.seventAppointments;

// {totalAppointments: 3, totalPatients: 2, totalEarning: 8500, totalRating: 2.5}
  
  // const stats : dashboard?.cards;
  // Stats data
  const stats = [
    {
      title: "Total Patients",
      value: cardData?.totalPatients,
      change: "+12%",
      isPositive: true,
      icon: FaUsers,
      color: "blue"
    },
    {
      title: "Appointments Today",
      value: cardData?.totalAppointments,
      change: "+5",
      isPositive: true,
      icon: FaCalendarCheck,
      color: "green"
    },
    {
      title: "Active Doctors",
      value: cardData?.ActiveDoctors,
      change: "+3",
      isPositive: true,
      icon: FaUserMd,
      color: "purple"
    },
    {
      title: "Total Earnings",
      value: cardData?.totalEarning,
      change: "+18",
      isPositive: true,
      icon: FaFlask,
      color: "orange"
    }
  ];

  // Chart configurations
  const appointmentChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Appointments",
        data: [23, 31, 28, 35, 29, 18, 12],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        fill: true
      }
    ]
  };

  const patientChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Patients",
        data: [85, 92, 78, 105, 98, 112],
        backgroundColor: "#10b981"
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)"
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // const recentAppointments = [
  //   {
  //     id: 1,
  //     patient: "Ahmed Hassan",
  //     doctor: "Dr. Sarah Khan",
  //     time: "10:30 AM",
  //     status: "confirmed",
  //     type: "Video Call"
  //   },
  //   {
  //     id: 2,
  //     patient: "Fatima Noor",
  //     doctor: "Dr. Ali Raza",
  //     time: "11:00 AM",
  //     status: "pending",
  //     type: "In-person"
  //   },
  //   {
  //     id: 3,
  //     patient: "Bilal Ahmed",
  //     doctor: "Dr. Ayesha Malik",
  //     time: "2:00 PM",
  //     status: "confirmed",
  //     type: "In-person"
  //   },
  //   {
  //     id: 4,
  //     patient: "Sara Yousuf",
  //     doctor: "Dr. Imran Ali",
  //     time: "3:30 PM",
  //     status: "completed",
  //     type: "Video Call"
  //   }
  // ];

  const pendingTasks = [
    { id: 1, task: "Review lab reports for patient #1234", priority: "high" },
    { id: 2, task: "Approve 3 new doctor registrations", priority: "medium" },
    { id: 3, task: "Update laboratory inventory", priority: "low" },
    { id: 4, task: "Process 5 pending appointments", priority: "high" }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      purple: "bg-purple-50 text-purple-600",
      orange: "bg-orange-50 text-orange-600"
    };
    return colors[color] || colors.blue;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "completed": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats?.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                <stat.icon className="text-2xl" />
              </div>
              <div className="flex items-center gap-1 text-sm">
                {stat.isPositive ? (
                  <FaArrowUp className="text-green-500" />
                ) : (
                  <FaArrowDown className="text-red-500" />
                )}
                <span className={stat.isPositive ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointments This Week</h3>
          <Line data={appointmentChartData} options={chartOptions} />
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">New Patients (Last 6 Months)</h3>
          <Bar data={patientChartData} options={chartOptions} />
        </div>
      </div>

      {/* Today's Appointments & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentAppointments?.map((apt) => (
              <div key={apt.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {apt?.patientId?.name.slice(0,1)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{apt?.patientId?.name}</h4>
                        <p className="text-sm text-gray-600">{apt?.doctorId?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-13 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FaClock className="text-gray-400" />
                        {apt?.selectedDate && new Date(apt.selectedDate).toLocaleDateString()}
                      </div>
                      <span>•</span>
                      <span>{apt?.appointmentType}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Pending Tasks</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3">
                  <div className="mt-1">
                    {task.priority === "high" ? (
                      <FaExclamationCircle className={getPriorityColor(task.priority)} />
                    ) : (
                      <FaCheckCircle className={getPriorityColor(task.priority)} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{task.task}</p>
                    <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-gray-900">92%</div>
          <div className="text-sm text-gray-600 mt-1">Appointment Success Rate</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-gray-900">4.8</div>
          <div className="text-sm text-gray-600 mt-1">Average Rating</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-gray-900">15 min</div>
          <div className="text-sm text-gray-600 mt-1">Avg Wait Time</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
          <div className="text-2xl font-bold text-gray-900">234</div>
          <div className="text-sm text-gray-600 mt-1">Reports Pending</div>
        </div>
      </div>
    </div>
  );
};

export default Overview;