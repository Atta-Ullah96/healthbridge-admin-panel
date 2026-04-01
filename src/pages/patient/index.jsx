import { useEffect, useState } from "react";
import {
  FaTrash,
  
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";
import { useDeletePatientMutation, useGetPatientsQuery } from "../../api/patient";





export default function Patients() {
  const { data } = useGetPatientsQuery({ page: 1, limit: 10, search: "", status: "all" })
  const patients = data?.patients;



  // UI states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 8;



  const [viewPatient, setViewPatient] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);




  // filtering and pagination logic
  const filtered = patients?.filter((p) => {
    const q = search.trim().toLowerCase();
    if (q) {
      if (
        !((p.name || "").toLowerCase().includes(q) ||
          (p.email || "").toLowerCase().includes(q) ||
          (p.phone || "").toLowerCase().includes(q))
      )
        return false;
    }
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered?.length / perPage));
  const pagePatients = filtered?.slice((page - 1) * perPage, page * perPage);


  const [deletePatient] = useDeletePatientMutation()
  async function handleDeletePatient(id) {
    try {
      await deletePatient(id).unwrap();
      alert("patient deleted successfully");
    } catch (error) {
      console.error(error);
      alert(error?.data?.message || "Delete failed");
    }
  }











  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Management</h1>
          <p className="text-sm text-gray-500">
            Manage patient profiles, appointments, and account status.
          </p>
        </div>

      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-white border rounded-lg"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Banned">Banned</option>
        </select>
        <div className="text-sm text-gray-600 font-medium">
          {filtered?.length} patient{filtered?.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 gap-4">
        {pagePatients?.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 border-2 border-indigo-300 overflow-hidden flex items-center justify-center flex-shrink-0">
                {p.avatar ? (
                  <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-indigo-700 font-bold text-lg">
                    {p?.name.slice(0, 1)}

                  </span>
                )}
              </div>

              {/* Patient Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{p?.name}</h3>
                    <p className="text-sm text-gray-500">
                      {p?.email} • {p?.phone}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Joined: {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">

                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 mt-3">

                  <button
                    onClick={() => setConfirmDelete(p)}
                    className="cursor-pointer px-3 py-1.5 bg-red-50 text-red-600 rounded-md flex items-center gap-2 text-sm hover:bg-red-100"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {pagePatients?.length === 0 && (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500">No patients found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <div className="px-4 py-2 border rounded-lg bg-indigo-50 text-indigo-700 font-medium">
              {page}
            </div>
            <button
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      )}



   

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Patient</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete <strong>{confirmDelete.name}</strong>?
              This action cannot be undone and will also delete all associated appointments.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePatient(confirmDelete._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}


