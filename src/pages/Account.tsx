import React, { useState } from 'react';
import { Camera, Mail, Key, Globe, Award, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export function AccountPage() {
  const { profile, signOut } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: profile?.email || '',
    languages: profile?.languages || '',
    certifications: profile?.certifications || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    setIsEditing(false);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Account Settings</h1>

        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-700 rounded-full overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Camera className="w-8 h-8" />
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-purple-500 rounded-full text-white hover:bg-purple-600">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">
                {profile?.full_name || 'Your Name'}
              </h2>
              <p className="text-gray-400 mb-4">{profile?.email}</p>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Languages</label>
                  <input
                    type="text"
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                    placeholder="e.g., English, Spanish"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Certifications</label>
                  <input
                    type="text"
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                    placeholder="e.g., ACE, NASM"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <div>{profile?.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-400">Languages</div>
                    <div>{profile?.languages || 'Not specified'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-400">Certifications</div>
                    <div>{profile?.certifications || 'Not specified'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Security</h3>
              <div className="space-y-4">
                <button className="flex items-center gap-2 text-gray-400 hover:text-white">
                  <Key className="w-5 h-5" />
                  Change Password
                </button>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-red-500 hover:text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}