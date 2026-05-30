import { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import { useLocation } from 'react-router';

export function ProfilePage() {
  const location = useLocation();
  const role = location.pathname.includes('mangaka') ? 'mangaka' :
               location.pathname.includes('assistant') ? 'assistant' :
               location.pathname.includes('tantou') ? 'tantou' : 'editorial';

  const [profileData, setProfileData] = useState({
    name: role === 'mangaka' ? 'Akira Tanaka' :
          role === 'assistant' ? 'John Doe' :
          role === 'tantou' ? 'Editor Yamamoto' : 'Editorial Board',
    email: 'user@example.com',
    phone: '+1 234 567 8900',
    location: 'Tokyo, Japan',
    bio: role === 'mangaka' ? 'Professional mangaka with 5+ years experience in action and fantasy genres.' :
         role === 'assistant' ? 'Skilled assistant specializing in lineart and coloring.' :
         role === 'tantou' ? 'Experienced editor managing multiple successful series.' :
         'Editorial board member overseeing publication strategy.',
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    taskReminders: true,
    weeklyReport: false,
    darkMode: false,
  });

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData);
    alert('Profile updated successfully!');
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const roleLabels = {
    mangaka: 'Mangaka',
    assistant: 'Assistant',
    tantou: 'Tantou Editor',
    editorial: 'Editorial Board',
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1>Profile & Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground text-2xl">
              {profileData.name.charAt(0)}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
              <Camera size={16} />
            </button>
          </div>

          <div className="flex-1">
            <h2>{profileData.name}</h2>
            <p className="text-muted-foreground mt-1">{roleLabels[role]}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-success/10 text-success border border-success/30 rounded-full text-sm">
              Active
            </span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <h2>Personal Information</h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="flex items-center gap-2 text-sm text-muted-foreground">
              <User size={16} />
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={16} />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone size={16} />
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} />
              Location
            </label>
            <input
              id="location"
              type="text"
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm text-muted-foreground">Bio</label>
          <textarea
            id="bio"
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-24 resize-none"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSaveProfile}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Save size={18} />
            Save Profile
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <h2>Notification Settings</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground mt-1">Receive email updates about your account</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors cursor-pointer">
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : ''
                }`} />
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium">Task Reminders</p>
              <p className="text-sm text-muted-foreground mt-1">Get reminded about pending tasks and deadlines</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.taskReminders}
                onChange={(e) => setSettings({ ...settings, taskReminders: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors cursor-pointer">
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.taskReminders ? 'translate-x-6' : ''
                }`} />
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium">Weekly Report</p>
              <p className="text-sm text-muted-foreground mt-1">Receive weekly summary of your activities</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.weeklyReport}
                onChange={(e) => setSettings({ ...settings, weeklyReport: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors cursor-pointer">
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.weeklyReport ? 'translate-x-6' : ''
                }`} />
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground mt-1">Switch to dark theme</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors cursor-pointer">
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.darkMode ? 'translate-x-6' : ''
                }`} />
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
