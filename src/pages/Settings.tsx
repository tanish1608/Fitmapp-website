import React, { useState } from 'react';
import { Bell, DollarSign, Globe, Mail } from 'lucide-react';

export function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false
  });

  const [preferences, setPreferences] = useState({
    currency: 'USD',
    language: 'en',
    timezone: 'UTC'
  });

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold">Notifications</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-gray-400">
                    Receive updates about your clients via email
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 text-purple-500 focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-sm text-gray-400">
                    Get instant notifications in your browser
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 text-purple-500 focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Marketing Emails</div>
                  <div className="text-sm text-gray-400">
                    Receive updates about new features and promotions
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.marketing}
                  onChange={(e) => setNotifications({ ...notifications, marketing: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 text-purple-500 focus:ring-purple-500"
                />
              </label>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold">Preferences</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Currency</label>
                <select
                  value={preferences.currency}
                  onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                  className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Timezone</label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                  className="w-full bg-[#232323] rounded-lg px-3 py-2 text-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="CST">Central Time</option>
                  <option value="PST">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold">Billing</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#232323] rounded-lg">
                <div>
                  <div className="font-medium">Free Plan</div>
                  <div className="text-sm text-gray-400">
                    Basic features for up to 5 clients
                  </div>
                </div>
                <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                  Upgrade
                </button>
              </div>

              <div className="text-sm text-gray-400">
                View our <a href="#" className="text-purple-500 hover:text-purple-400">pricing plans</a> to unlock more features
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}