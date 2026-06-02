import { useState } from 'react';
import { User, Mail, Phone, Camera, Save } from 'lucide-react';
import { useLocation } from 'react-router';

export function ProfilePage() {
  const location = useLocation();
  const role = location.pathname.includes('mangaka') ? 'mangaka' :
               location.pathname.includes('assistant') ? 'assistant' :
               location.pathname.includes('tantou') ? 'tantou' :
               location.pathname.includes('admin') ? 'admin' : 'editorial';

  const [profileData, setProfileData] = useState({
    firstName: role === 'mangaka' ? 'Akira' :
               role === 'assistant' ? 'John' :
               role === 'tantou' ? 'Editor' :
               role === 'admin' ? 'System' : 'Editorial',
    lastName: role === 'mangaka' ? 'Tanaka' :
              role === 'assistant' ? 'Doe' :
              role === 'tantou' ? 'Yamamoto' :
              role === 'admin' ? 'Administrator' : 'Board',
    email: 'user@example.com',
    phone: '+1 234 567 8900',
    bio: role === 'mangaka' ? 'Professional mangaka with 5+ years experience in action and fantasy genres.' :
         role === 'assistant' ? 'Skilled assistant specializing in lineart and coloring.' :
         role === 'tantou' ? 'Experienced editor managing multiple successful series.' :
         role === 'admin' ? 'System administrator overseeing platform configuration and user management.' :
         'Editorial board member overseeing publication strategy.',
  });

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData);
    alert('Profile updated successfully!');
  };

  const roleLabels = {
    mangaka: 'Mangaka',
    assistant: 'Assistant',
    tantou: 'Tantou Editor',
    editorial: 'Editorial Board',
    admin: 'Admin',
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1>Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground text-2xl">
              {profileData.firstName?.charAt(0) || ''}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
              <Camera size={16} />
            </button>
          </div>

          <div className="flex-1">
            <h2>{`${profileData.firstName} ${profileData.lastName}`}</h2>
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
            <label htmlFor="firstName" className="flex items-center gap-2 text-sm text-muted-foreground">
              <User size={16} />
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={profileData.firstName}
              onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
              className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="flex items-center gap-2 text-sm text-muted-foreground">
              <User size={16} />
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={profileData.lastName}
              onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
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
    </div>
  );
}
