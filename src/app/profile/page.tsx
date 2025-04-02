"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserCircle, Lock, Settings, Activity, PieChart } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: string;
  createdAt?: string;
}

interface UserPreferences {
  defaultStructureType: string;
  notifications?: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  
  const [name, setName] = useState("");
  const [defaultStructureType, setDefaultStructureType] = useState("enhanced");
  const [notifications, setNotifications] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [conversionsCount, setConversionsCount] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (status === "authenticated") {
          const response = await fetch("/api/profile");
          if (response.ok) {
            const data: UserProfile = await response.json();
            setName(data.name || "");
            
            if (data.preferences) {
              try {
                const preferences: UserPreferences = JSON.parse(data.preferences);
                if (preferences.defaultStructureType) {
                  setDefaultStructureType(preferences.defaultStructureType);
                }
                if (preferences.notifications !== undefined) {
                  setNotifications(preferences.notifications);
                }
              } catch (e) {
                // If preferences can't be parsed, use defaults
              }
            }
            
            // Fetch user stats
            const statsResponse = await fetch("/api/profile/stats");
            if (statsResponse.ok) {
              const stats = await statsResponse.json();
              setConversionsCount(stats.conversionsCount || 0);
            }
          }
        }
      } catch (error) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const preferences: UserPreferences = {
        defaultStructureType,
        notifications
      };

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          preferences,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Profile saved successfully");
        // Update the session name
        await update({
          ...session,
          user: {
            ...session?.user,
            name
          }
        });
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save profile");
      }
    } catch (error) {
      setError("An error occurred while saving your profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccessMessage("");

    // Validation
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setSaving(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/profile/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to change password");
      }
    } catch (error) {
      setError("An error occurred while changing your password");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-black">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">My Profile</h1>

      {/* Profile Header with Account Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap items-center">
          <div className="flex items-center mr-8 mb-4 md:mb-0">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <UserCircle className="h-12 w-12 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-black">{session?.user?.name || "User"}</h2>
              <p className="text-black">{session?.user?.email}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-6 ml-auto">
            <div className="text-center">
              <p className="text-2xl font-bold text-black">{conversionsCount}</p>
              <p className="text-sm text-black">Conversions</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 font-medium border border-red-200">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 font-medium border border-green-200">
          {successMessage}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("general")}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === "general"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-black hover:text-black"
            }`}
          >
            <div className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              General
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab("security")}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === "security"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-black hover:text-black"
            }`}
          >
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Security
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab("activity")}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === "activity"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-black hover:text-black"
            }`}
          >
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTab === "general" && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 font-medium text-black">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md text-black"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-medium text-black">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={session?.user?.email || ""}
                disabled
                className="w-full p-2.5 border border-gray-300 rounded-md text-black bg-gray-50"
              />
              <p className="mt-1 text-sm text-black">Your email cannot be changed</p>
            </div>

            <div className="mb-4">
              <label htmlFor="defaultStructureType" className="block mb-2 font-medium text-black">
                Default XML Structure Type
              </label>
              <select
                id="defaultStructureType"
                value={defaultStructureType}
                onChange={(e) => setDefaultStructureType(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md text-black"
              >
                <option value="basic">Basic (Text with positions)</option>
                <option value="enhanced">Enhanced (Text grouped by paragraphs)</option>
                <option value="full">Full (Complete document structure)</option>
              </select>
              <p className="mt-1 text-sm text-black">
                This will be the default structure type used when converting PDFs.
              </p>
            </div>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-black">Enable email notifications</span>
              </label>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        )}

        {activeTab === "security" && (
          <form onSubmit={handlePasswordChange}>
            <h2 className="text-xl font-semibold mb-4 text-black">Change Password</h2>
            
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block mb-2 font-medium text-black">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md text-black"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="newPassword" className="block mb-2 font-medium text-black">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md text-black"
                required
                minLength={8}
              />
              <p className="mt-1 text-sm text-black">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-2 font-medium text-black">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md text-black"
                required
              />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}

        {activeTab === "activity" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-black">Account Activity</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2 text-black">Statistics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <PieChart className="w-8 h-8 text-blue-500 mr-4" />
                    <div>
                      <p className="text-xl font-bold text-black">{conversionsCount}</p>
                      <p className="text-sm text-black">Total Conversions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-black">
              Visit the <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a> to see your recent conversions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 