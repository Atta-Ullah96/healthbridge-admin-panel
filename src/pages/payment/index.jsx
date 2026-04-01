import { useState, useEffect } from "react";
import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaTimes,
  FaSearch,
  FaCalendarAlt,
  FaUserMd
} from "react-icons/fa";

const STORAGE_KEY = "hb_doctor_payments_v1";

const initialPayments = [
  {
    id: 1,
    patient: "Ahmed Hassan",
    doctor: "Dr. Sarah Khan",
    specialty: "Cardiologist",
    amount: 5000,
    appointmentDate: "2025-01-15",
    paymentDate: "2025-01-15",
    releaseDate: null,
    status: "Pending",
    appointmentType: "Video Call"
  },
  {
    id: 2,
    patient: "Fatima Noor",
    doctor: "Dr. Ali Raza",
    specialty: "General Physician",
    amount: 3000,
    appointmentDate: "2025-01-12",
    paymentDate: "2025-01-12",
    releaseDate: "2025-01-18",
    status: "Released",
    appointmentType: "In-person"
  },
  {
    id: 3,
    patient: "Bilal Ahmed",
    doctor: "Dr. Ayesha Malik",
    specialty: "Dermatologist",
    amount: 4500,
    appointmentDate: "2025-01-14",
    paymentDate: "2025-01-14",
    releaseDate: null,
    status: "Pending",
    appointmentType: "In-person"
  },
  {
    id: 4,
    patient: "Sara Yousuf",
    doctor: "Dr. Imran Ali",
    specialty: "Pediatrician",
    amount: 3500,
    appointmentDate: "2025-01-10",
    paymentDate: "2025-01-10",
    releaseDate: "2025-01-16",
    status: "Released",
    appointmentType: "Video Call"
  },
  {
    id: 5,
    patient: "Usman Khan",
    doctor: "Dr. Sarah Khan",
    specialty: "Cardiologist",
    amount: 6000,
    appointmentDate: "2025-01-16",
    paymentDate: "2025-01-16",
    releaseDate: null,
    status: "Pending",
    appointmentType: "In-person"
  },
];

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPayments));
      return initialPayments;
    }
    return JSON.parse(saved);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPayments));
    return initialPayments;
  }
}

const PaymentManagement = () => {
  const [payments, setPayments] = useState(loadData());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewingPayment, setViewingPayment] = useState(null);
  const [releaseConfirm, setReleaseConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const notify = (msg) => setNotification(msg);

  const handleRelease = (id) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "Released",
              releaseDate: new Date().toISOString().split("T")[0],
            }
          : p
      )
    );
    setReleaseConfirm(null);
    notify("Payment released successfully!");
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter((p) => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0),
    released: payments.filter((p) => p.status === "Released").reduce((sum, p) => sum + p.amount, 0),
    pendingCount: payments.filter((p) => p.status === "Pending").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Payments</h1>
        <p className="text-gray-600 mt-1">Manage and release payments to doctors</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <FaMoneyBillWave className="text-2xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Rs. {stats.total.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Total Payments</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
              <FaClock className="text-2xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Rs. {stats.pending.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Pending Release</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <FaCheckCircle className="text-2xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Rs. {stats.released.toLocaleString()}</h3>
          <p className="text-sm text-gray-600">Released</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
              <FaUserMd className="text-2xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.pendingCount}</h3>
          <p className="text-sm text-gray-600">Awaiting Release</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient or doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="released">Released</option>
        </select>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {payment.patient.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{payment.patient}</h3>
                        <p className="text-sm text-gray-600">Patient</p>
                      </div>
                    </div>
                    <div className="text-gray-400">→</div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {payment.doctor.split(" ").filter(n => n !== "Dr.").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{payment.doctor}</h3>
                        <p className="text-sm text-gray-600">{payment.specialty}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Amount:</span>
                      <p className="font-semibold text-gray-900 text-lg">Rs. {payment.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Appointment:</span>
                      <p className="font-medium text-gray-700">
                        {new Date(payment.appointmentDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <p className="font-medium text-gray-700">{payment.appointmentType}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            payment.status === "Released"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-6">
                  <button
                    onClick={() => setViewingPayment(payment)}
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 flex items-center gap-2 text-sm"
                  >
                    <FaEye /> View Details
                  </button>
                  {payment.status === "Pending" && (
                    <button
                      onClick={() => setReleaseConfirm(payment)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 text-sm"
                    >
                      <FaCheckCircle /> Release Payment
                    </button>
                  )}
                  {payment.status === "Released" && (
                    <div className="px-4 py-2 text-center text-sm text-gray-500">
                      Released on<br/>
                      {new Date(payment.releaseDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredPayments.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <FaMoneyBillWave className="text-gray-300 text-5xl mx-auto mb-4" />
            <p className="text-gray-500">No payments found</p>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {viewingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
              <button
                onClick={() => setViewingPayment(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient & Doctor Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                      {viewingPayment.patient.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{viewingPayment.patient}</div>
                      <div className="text-sm text-gray-600">Patient</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Doctor Information</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                      {viewingPayment.doctor.split(" ").filter(n => n !== "Dr.").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{viewingPayment.doctor}</div>
                      <div className="text-sm text-gray-600">{viewingPayment.specialty}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Amount:</span>
                  <span className="font-bold text-2xl text-gray-900">Rs. {viewingPayment.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Appointment Date:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(viewingPayment.appointmentDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Appointment Type:</span>
                  <span className="font-medium text-gray-900">{viewingPayment.appointmentType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Received:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(viewingPayment.paymentDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      viewingPayment.status === "Released"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {viewingPayment.status}
                  </span>
                </div>
                {viewingPayment.releaseDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Released On:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(viewingPayment.releaseDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setViewingPayment(null)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Release Confirmation Modal */}
      {releaseConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Release Payment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to release <strong>Rs. {releaseConfirm.amount.toLocaleString()}</strong> to{" "}
              <strong>{releaseConfirm.doctor}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setReleaseConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRelease(releaseConfirm.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm Release
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
          <FaCheckCircle />
          {notification}
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;