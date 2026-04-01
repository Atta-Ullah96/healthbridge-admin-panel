import { useState } from "react";

export default function Setting() {
  const [activeTab, setActiveTab] = useState("general");

  // state to hold settings
  const [settings, setSettings] = useState({
    // General
    siteName: "HealthBridge",
    tagline: "Doctor Appointment & Teleconsultation System",
    timezone: "Asia/Karachi",
    language: "English",

    // Financial
    commission: 20,
    serviceFee: 5,
    currency: "USD",
    payoutCycle: "weekly",
    taxRate: 0,

    // Communication
    adminEmail: "admin@healthbridge.com",
    supportEmail: "support@healthbridge.com",
    contactNumber: "+92-300-1234567",
    smsNotifications: true,

    // Security
    doctorVerification: "manual",
    requireDocuments: true,
    passwordMinLength: 8,
    twoFactorAuth: false,

    // Platform
    appointmentDuration: 30,
    cancellationPolicy: 12,
    refundPolicy: "Refund only if cancelled before 12 hours.",
    fileUploadLimit: 10,

    // Legal
    terms: "Enter terms and conditions here...",
    privacy: "Enter privacy policy here...",
  });

  // handle change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // save handler
  const handleSave = () => {
    console.log("Settings Saved:", settings);
    alert("✅ Settings Saved!");
    // here you will call API: PUT /api/admin/settings
  };

  const tabs = [
    { id: "general", label: "General" },
    { id: "financial", label: "Financial" },
    { id: "communication", label: "Communication" },
    { id: "security", label: "Security" },
    { id: "platform", label: "Platform" },
    { id: "legal", label: "Legal" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">⚙️ Admin Settings</h2>

      {/* Tabs */}
      <div className="flex border-b mb-6 space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 text-lg ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Site Name</label>
            <input
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tagline</label>
            <input
              name="tagline"
              value={settings.tagline}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Timezone</label>
            <input
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Default Language</label>
            <select
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            >
              <option>English</option>
              <option>Urdu</option>
              <option>Arabic</option>
            </select>
          </div>
        </div>
      )}

      {/* Financial Settings */}
      {activeTab === "financial" && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Commission (%)</label>
            <input
              type="number"
              name="commission"
              value={settings.commission}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Service Fee (%)</label>
            <input
              type="number"
              name="serviceFee"
              value={settings.serviceFee}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Currency</label>
            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            >
              <option>USD</option>
              <option>PKR</option>
              <option>EUR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Payout Cycle</label>
            <select
              name="payoutCycle"
              value={settings.payoutCycle}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="instant">Instant</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Tax Rate (%)</label>
            <input
              type="number"
              name="taxRate"
              value={settings.taxRate}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
        </div>
      )}

      {/* Communication Settings */}
      {activeTab === "communication" && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Admin Email</label>
            <input
              name="adminEmail"
              type="email"
              value={settings.adminEmail}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Support Email</label>
            <input
              name="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Contact Number</label>
            <input
              name="contactNumber"
              value={settings.contactNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="smsNotifications"
              checked={settings.smsNotifications}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">Enable SMS Notifications</span>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Doctor Verification</label>
            <select
              name="doctorVerification"
              value={settings.doctorVerification}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="manual">Manual</option>
              <option value="auto">Automatic</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="requireDocuments"
              checked={settings.requireDocuments}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">Require ID/License Upload</span>
          </div>

          <div>
            <label className="block text-sm font-medium">Password Minimum Length</label>
            <input
              type="number"
              name="passwordMinLength"
              value={settings.passwordMinLength}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="twoFactorAuth"
              checked={settings.twoFactorAuth}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">Enable Two-Factor Authentication</span>
          </div>
        </div>
      )}

      {/* Platform Settings */}
      {activeTab === "platform" && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Default Appointment Duration (minutes)</label>
            <input
              type="number"
              name="appointmentDuration"
              value={settings.appointmentDuration}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Cancellation Policy (hours before)</label>
            <input
              type="number"
              name="cancellationPolicy"
              value={settings.cancellationPolicy}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Refund Policy</label>
            <textarea
              name="refundPolicy"
              value={settings.refundPolicy}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">File Upload Limit (MB)</label>
            <input
              type="number"
              name="fileUploadLimit"
              value={settings.fileUploadLimit}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
        </div>
      )}

      {/* Legal Settings */}
      {activeTab === "legal" && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Terms & Conditions</label>
            <textarea
              name="terms"
              value={settings.terms}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Privacy Policy</label>
            <textarea
              name="privacy"
              value={settings.privacy}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              rows={4}
            />
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-8">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
