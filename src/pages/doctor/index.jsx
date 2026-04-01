import { useState } from "react";
import { useBanDoctorMutation, useDeleteDoctorMutation, useGetDoctorByIdQuery, useGetDoctorsQuery, useUnbanDoctorMutation, useVerifyDoctorMutation } from "../../api/doctor";


// ─── STATUS HELPERS ──────────────────────────────────────────────────────────
const getStatus = (doctor) => {
  if (doctor?.isBanned) return "blocked";
  if (doctor?.isVerified) return "approved";
  if (doctor?.isRejected) return "rejected";
  return "pending";
};

const STATUS_CONFIG = {
  approved: { label: "Approved", dot: "bg-emerald-400", badge: "text-emerald-700 bg-emerald-50 border-emerald-200 ring-emerald-100" },
  pending: { label: "Pending", dot: "bg-amber-400", badge: "text-amber-700 bg-amber-50 border-amber-200 ring-amber-100" },
  rejected: { label: "Rejected", dot: "bg-rose-400", badge: "text-rose-700 bg-rose-50 border-rose-200 ring-rose-100" },
  blocked: { label: "Blocked", dot: "bg-slate-400", badge: "text-slate-700 bg-slate-50 border-slate-200 ring-slate-100" },
};

// ─── ICONS ───────────────────────────────────────────────────────────────────
const ic = (d) => ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);
const UserIcon = ic("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z");
const MailIcon = ic("M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z");
const PhoneIcon = ic("M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z");
const BadgeIcon = ic("M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z");
const StarIcon = ic("M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z");
const ClockIcon = ic("M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z");
const GraduateIcon = ic("M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222");
const FileIcon = ic("M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z");
const EyeIcon = ic("M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z");
const DownloadIcon = ic("M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4");
const CheckIcon = ic("M5 13l4 4L19 7");
const XIcon = ic("M6 18L18 6M6 6l12 12");
const BanIcon = ic("M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636");
const UnbanIcon = ic("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z");
const TrashIcon = ic("M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16");

// ─── DOCUMENT VIEWER MODAL ───────────────────────────────────────────────────
function DocViewerModal({ doc, onClose }) {
  if (!doc) return null;
  const isPDF = doc.url?.toLowerCase().endsWith(".pdf");
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden" style={{ maxHeight: "90vh" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-base">{doc?.purpose}</h3>
          <div className="flex items-center gap-3">
            <a href={doc?.url} download target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors">
              <DownloadIcon className="w-4 h-4" /> Download
            </a>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <XIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          {isPDF
            ? <iframe src={doc?.url} className="w-full rounded-lg border border-gray-200" style={{ height: "60vh" }} title={doc.label} />
            : <img src={doc?.url} alt={doc?.purpose} className="max-w-full mx-auto rounded-xl shadow-sm border border-gray-200" />
          }
        </div>
      </div>
    </div>
  );
}

// ─── ACTION BUTTON ───────────────────────────────────────────────────────────
function ActionButton({ color, icon, label, onClick }) {
  const colorMap = {
    emerald: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200",
    rose: "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200",
    orange: "bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200",
    sky: "bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200",
    red: "bg-red-50 hover:bg-red-100 text-red-700 border-red-200",
  };
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${colorMap[color]}`}>
      {icon}{label}
    </button>
  );
}

// ─── DETAIL MODAL ────────────────────────────────────────────────────────────
function DoctorDetailModal({ doctor, onClose }) {
  const [activeDoc, setActiveDoc] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  if (!doctor) return null;

  const status = getStatus(doctor);
  const cfg = STATUS_CONFIG[status];



  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <span className="text-gray-400 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm text-gray-800 font-medium break-all">{value || "—"}</p>
      </div>
    </div>
  );

  const ACTION_MAP = {
    verify: { label: "Verify", color: "bg-emerald-600 hover:bg-emerald-700", fn: () => { onVerify(doctor._id); onClose(); } },
    reject: { label: "Reject", color: "bg-rose-600 hover:bg-rose-700", fn: () => { onReject(doctor._id); onClose(); } },
    ban: { label: "Block", color: "bg-orange-600 hover:bg-orange-700", fn: () => { onBan(doctor._id); onClose(); } },
    unban: { label: "Unblock", color: "bg-sky-600 hover:bg-sky-700", fn: () => { onUnban(doctor._id); onClose(); } },
    delete: { label: "Delete", color: "bg-red-700 hover:bg-red-800", fn: () => { onDelete(doctor._id); onClose(); } },
  };

  return (
    <>
      {activeDoc && <DocViewerModal doc={activeDoc} onClose={() => setActiveDoc(null)} />}

      {confirmAction && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <h4 className="font-semibold text-gray-900 mb-2 capitalize">{confirmAction} Doctor</h4>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to <strong>{ACTION_MAP[confirmAction].label.toLowerCase()}</strong> {doctor.name}?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={() => { ACTION_MAP[confirmAction].fn(); setConfirmAction(null); }}
                className={`px-4 py-2 text-sm rounded-xl text-white font-medium ${ACTION_MAP[confirmAction].color}`}>
                {ACTION_MAP[confirmAction].label}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden" style={{ maxHeight: "92vh" }}>

          {/* Header */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 px-6 pt-6 pb-10">
            <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white">
              <XIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4">
              {doctor?.profileImage
                ? <img src={doctor?.profileImage} alt={doctor?.firstName} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-lg" />
                : <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {doctor?.name?.charAt(0) || "D"}
                </div>
              }
              <div>
                <h2 className="text-xl font-bold text-white">{doctor?.firstName}</h2>
                <p className="text-indigo-200 text-sm">{doctor?.specialization}</p>
                <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-0.5 rounded-full text-xs font-semibold border ring-1 ${cfg.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.label}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto -mt-4">
            <div className="bg-gray-50 rounded-t-2xl px-6 pt-6 pb-6 space-y-5">

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Personal Information</h3>
                <div className="bg-white rounded-xl px-4 py-1 shadow-sm border border-gray-100">
                  <InfoRow icon={<UserIcon />} label="Full Name" value={doctor?.firstName + doctor?.lastName} />
                  <InfoRow icon={<MailIcon />} label="Email" value={doctor?.email} />
                  <InfoRow icon={<PhoneIcon />} label="Phone Number" value={doctor?.phone} />
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Professional Details</h3>
                <div className="bg-white rounded-xl px-4 py-1 shadow-sm border border-gray-100">
                  <InfoRow icon={<BadgeIcon />} label="Medical License Number" value={doctor?.pmcnumber} />
                  <InfoRow icon={<StarIcon />} label="Specialization" value={doctor?.specialization} />
                  <InfoRow icon={<ClockIcon />} label="Years of Experience" value={doctor?.experience ? `${doctor.experience} years` : null} />
                  <InfoRow icon={<GraduateIcon />} label="Qualification" value={doctor?.qualification} />
                </div>
              </section>

              {doctor?.documents.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Documents</h3>
                  <div className="space-y-2">
                    {doctor?.documents.map((doc) => (
                      <div key={doc.purpose} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <FileIcon className="w-5 h-5 text-indigo-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{doc?.purpose}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setActiveDoc(doc)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                            <EyeIcon className="w-3.5 h-3.5" /> View
                          </button>
                          <a href={doc?.url} download target="_blank" rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
                            <DownloadIcon className="w-3.5 h-3.5" /> Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}



            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function DoctorManagement() {
  // const [doctors, setDoctors]         = useState(DUMMY_DOCTORS);
  const { data } = useGetDoctorsQuery({ page: 1, limit: 10, search: "", status: "all" })
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [notification, setNotification] = useState(null);
  const { data: singleDoctor } = useGetDoctorByIdQuery(selectedDoctor)

  const doctors = data?.doctors;
  const [
    verifyDoctorMutation,
    { isLoading: isVerifying }
  ] = useVerifyDoctorMutation();

  const [
    banDoctorMutation,
    { isLoading: isBanning }
  ] = useBanDoctorMutation();

  const [
    unbanDoctorMutation,
    { isLoading: isUnbanning }
  ] = useUnbanDoctorMutation();

  const [
    deleteDoctorMutation,
    { isLoading: isDeleting }
  ] = useDeleteDoctorMutation();

  const verifyDoctor = async (id) => {
    try {
      await verifyDoctorMutation(id).unwrap();
      alert("Doctor verified successfully");
    } catch (error) {
      console.error(error);
      alert(error?.data?.message || "Verification failed");
    }
  };

  const banDoctor = async (id) => {
    try {
      await banDoctorMutation(id).unwrap();
      alert("Doctor banned successfully");
    } catch (error) {
      console.error(error);
      alert(error?.data?.message || "Ban failed");
    }
  };

  const unbanDoctor = async (id) => {
    try {
      await unbanDoctorMutation(id).unwrap();
      alert("Doctor unbanned successfully");
    } catch (error) {
      console.error(error);
      alert(error?.data?.message || "Unban failed");
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await deleteDoctorMutation(id).unwrap();
      alert("Doctor deleted successfully");
    } catch (error) {
      console.error(error);
      alert(error?.data?.message || "Delete failed");
    }
  };
  const LIMIT = 5;

  const notify = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };



  const filtered = doctors?.filter((d) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q) || d.specialization?.toLowerCase().includes(q);
    const s = getStatus(d);
    const matchStatus = statusFilter === "all"
      || (statusFilter === "verified" && s === "approved")
      || (statusFilter === "pending" && s === "pending")
      || (statusFilter === "rejected" && s === "rejected")
      || (statusFilter === "banned" && s === "blocked");
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered?.length / LIMIT));
  const paginated = filtered?.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const stats = {
    total: doctors?.length,
    approved: doctors?.filter((d) => d.isVerified && !d.isBanned)?.length,
    pending: doctors?.filter((d) => !d.isVerified && !d.isBannede && !d.isRejected)?.length,
    blocked: doctors?.filter((d) => d.isBanned)?.length,
  };

  const STAT_CARDS = [
    { label: "Total Doctors", value: stats.total, color: "text-indigo-700", bg: "from-indigo-50 to-indigo-100/50", border: "border-indigo-100" },
    { label: "Approved", value: stats.approved, color: "text-emerald-700", bg: "from-emerald-50 to-emerald-100/50", border: "border-emerald-100" },
    { label: "Pending Review", value: stats.pending, color: "text-amber-700", bg: "from-amber-50 to-amber-100/50", border: "border-amber-100" },
    { label: "Blocked", value: stats.blocked, color: "text-rose-700", bg: "from-rose-50 to-rose-100/50", border: "border-rose-100" },
  ];

  return (
    <div className="min-h-screen p-6" style={{ background: "linear-gradient(135deg,#f8f7ff 0%,#f0f4ff 50%,#fafafa 100%)" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap'); .dm{font-family:'Sora',sans-serif}`}</style>

      <div className="dm max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Doctor Management</h1>
          <p className="text-gray-500 text-sm">Review, verify, and manage doctor registrations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className={`bg-gradient-to-br ${s.bg} rounded-2xl border ${s.border} p-5`}>
              <p className="text-xs font-medium text-gray-500 mb-2">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search by name, email, or specialization…" value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition" />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="text-sm px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white text-gray-700 cursor-pointer">
              <option value="all">All Status</option>
              <option value="verified">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="banned">Blocked</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {paginated?.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Doctor", "Specialization", "Experience", "Patients", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((doctor) => {
                    const status = getStatus(doctor);
                    const cfg = STATUS_CONFIG[status];
                    return (
                      <tr key={doctor._id} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {doctor?.profileImage
                              ? <img src={doctor?.profileImage} alt={doctor?.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                              : <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">{doctor.name.charAt(0)}</div>
                            }
                            <div>
                              <p className="font-semibold text-gray-800">{doctor?.name}</p>
                              <p className="text-gray-400 text-xs">{doctor?.email}</p>
                              <p className="text-gray-400 text-xs">{doctor?.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-700">{doctor?.specialization}</td>
                        <td className="px-5 py-4 text-gray-700">{doctor?.experience ? `${doctor?.experience} yrs` : "—"}</td>
                        <td className="px-5 py-4 text-gray-700">{doctor?.totalPatients ?? 0}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ring-1 ${cfg.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {status === "pending" && <><button onClick={() => setConfirmAction({ type: "verify", doctor })} className="cursor-pointer px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition">Verify</button><button onClick={() => setConfirmAction({ type: "reject", doctor })} className="cursor-pointer px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-100 hover:bg-rose-200 text-rose-700 transition">Reject</button></>}
                            {status === "approved" && <button onClick={() => setConfirmAction({ type: "ban", doctor })} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-100 hover:bg-orange-200 text-orange-700 transition cursor-pointer">Block</button>}
                            {status === "blocked" && <button onClick={() => setConfirmAction({ type: "unban", doctor })} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-sky-100 hover:bg-sky-200 text-sky-700 transition cursor-pointer">Unblock</button>}
                            {status === "rejected" && <button onClick={() => setConfirmAction({ type: "verify", doctor })} className="cursor-pointer px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition">Verify</button>}
                            <button onClick={() => setSelectedDoctor(doctor.id)} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition cursor-pointer">View Details</button>
                            <button onClick={() => setConfirmAction({ type: "delete", doctor })} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-100 hover:bg-red-200 text-red-700 transition cursor-pointer">Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">Page {currentPage} of {totalPages} · {filtered?.length} doctors</p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">← Previous</button>
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition">Next →</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-7 h-7 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-700 mb-1">No doctors found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDoctor && (
        <DoctorDetailModal
          doctor={singleDoctor?.data}
          onClose={() => setSelectedDoctor(null)}

        />
      )}

      {/* Quick Confirm Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="font-bold text-gray-900 mb-2 capitalize">{confirmAction.type} Doctor</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to <strong>{confirmAction.type}</strong> {confirmAction.doctor.name}?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button
                onClick={() => {
                  const id = confirmAction.doctor.id;
                  if (confirmAction.type === "verify") verifyDoctor(id);
                  if (confirmAction.type === "ban") banDoctor(id);
                  if (confirmAction.type === "unban") unbanDoctor(id);
                  if (confirmAction.type === "delete") deleteDoctor(id);
                  setConfirmAction(null);
                }}
                className={`px-4 py-2 text-sm rounded-xl text-white font-medium transition ${confirmAction.type === "verify" ? "bg-emerald-600 hover:bg-emerald-700"
                  : confirmAction.type === "unban" ? "bg-sky-600 hover:bg-sky-700"
                    : confirmAction.type === "ban" ? "bg-orange-600 hover:bg-orange-700"
                      : confirmAction.type === "reject" ? "bg-rose-600 hover:bg-rose-700"
                        : "bg-red-700 hover:bg-red-800"
                  }`}
              >
                {confirmAction.type === "verify" ? "Verify" : confirmAction.type === "ban" ? "Block" : confirmAction.type === "unban" ? "Unblock" : confirmAction.type === "reject" ? "Reject" : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[80]">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-medium ${notification.type === "success" ? "bg-emerald-600" : notification.type === "warning" ? "bg-orange-500" : "bg-red-600"
            }`}>
            <span className="w-2 h-2 rounded-full bg-white/60 animate-pulse" />
            {notification.message}
          </div>
        </div>
      )}
    </div>
  );
}