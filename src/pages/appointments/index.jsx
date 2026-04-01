import { useState } from "react";
import {
  FaCalendarAlt,

  FaCheck,
  FaTimes,
  FaClock,
  FaVideo,
  FaClinicMedical,
  FaUserMd,
  FaUser,
  FaCheckCircle
} from "react-icons/fa";
import { useCancelAppointmentMutation, useCompleteAppointmentMutation, useConfirmAppointmentMutation, useGetAppointmentsQuery } from "../../api/appointment";


export default function Appointment() {
  const { data } = useGetAppointmentsQuery({ page: 1, limit: 10, search: "", status: "all" })
  const appointments = data?.appointments;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // filtering logic
  const filteredAppointments = appointments?.filter((apt) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      apt?.patientId?.name.toLowerCase().includes(searchLower) ||
      apt.doctorId?.name.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // pagination
  const totalPages = Math.ceil(filteredAppointments?.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments?.slice(startIdx, startIdx + itemsPerPage);

  const [canceAppointment] = useCancelAppointmentMutation()
  const [confrimApointment] = useConfirmAppointmentMutation()
  const [completeAppointment] = useCompleteAppointmentMutation()

  const handleConfirmAppointment = async (id) => {
    try {
      await confrimApointment(id).unwrap();
      alert("Appointment confirmed successfully");
    } catch (error) {
      console.error(error);
      alert(error?.data?.message || "Cancel failed");
    }
  }

  const handleCompletedAppintment = async (id) => {
    try {
      await completeAppointment(id).unwrap();
      alert("Appointment completed successfully");
    } catch (error) {
      console.error(error);
      alert(error?.data?.message || "Cancel failed");
    }
  }

  const handleCancelAppointment = async (id) => {

    try {
      await canceAppointment(id).unwrap();
      alert("Appointment Canclled successfully");
    } catch (error) {
      console.error(error);
      alert(error?.data?.message || "Cancel failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type) => {
    return type === "Video Call" ? <FaVideo className="text-blue-500" /> : <FaClinicMedical className="text-green-500" />;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all patient appointments
          </p>
        </div>

      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Total</div>
          <div className="text-2xl font-bold text-gray-800">{appointments?.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Confirmed</div>
          <div className="text-2xl font-bold text-blue-600">
            {appointments?.filter(a => a.status === "confirmed").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {appointments?.filter(a => a.status === "pending").length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-600">
            {appointments?.filter(a => a.status === "completed").length}
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by patient or doctor name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Appointments list */}
      <div className="space-y-3">
        {paginatedAppointments?.length > 0 ? (
          paginatedAppointments?.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Date badge */}
                <div className="flex-shrink-0 bg-indigo-50 rounded-lg p-3 text-center w-20">
                  <div className="text-xs text-indigo-600 font-medium">
                    {new Date(apt?.slotId?.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </div>
                  <div className="text-2xl font-bold text-indigo-700">
                    {new Date(apt?.slotId?.date).getDate()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(apt?.slotId?.date).getFullYear()}
                  </div>
                </div>

                {/* Appointment details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaUser className="text-gray-400 text-sm" />
                        <span className="font-semibold text-gray-800">{apt?.patientId?.name}</span>
                        <span className="text-gray-400">→</span>
                        <FaUserMd className="text-gray-400 text-sm" />
                        <span className="font-semibold text-gray-700">{apt?.doctorId?.name}</span>
                      </div>
                      <div className="text-sm text-gray-500">{apt?.doctorId?.name}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt?.status)}`}>
                      {apt?.status.charAt(0).toUpperCase() + apt?.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <FaClock className="text-gray-400" />
                      <span>{apt?.slotId?.startTime} ({apt?.duration})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(apt?.appointmentType)}
                      <span>{apt?.appointmentType}</span>
                    </div>
                  </div>

                  {/* Action buttons */} 
                  <div className="flex flex-wrap gap-2 cursor-pointer ">


                    {apt?.status === "pending" && (
                      <button
                        onClick={() => handleConfirmAppointment(apt?._id)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md flex items-center gap-1 text-sm hover:bg-blue-100"
                      >
                        <FaCheck /> Confirm
                      </button>
                    )}

                    {apt?.status === "confirmed" && (
                      <button
                        onClick={() => handleCompletedAppintment(apt?._id)}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-md flex items-center gap-1 text-sm hover:bg-emerald-100"
                      >
                        <FaCheckCircle /> Complete
                      </button>
                    )}

                    {apt?.status !== "cancelled" && apt?.status !== "completed" && (
                      <button
                        onClick={() => handleCancelAppointment(apt?._id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md flex items-center gap-1 text-sm hover:bg-red-100"
                      >
                        <FaTimes /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <FaCalendarAlt className="text-gray-300 text-5xl mx-auto mb-4" />
            <p className="text-gray-500">No appointments found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, filteredAppointments.length)} of {filteredAppointments.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
              {currentPage}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}


    </div>
  );
}
