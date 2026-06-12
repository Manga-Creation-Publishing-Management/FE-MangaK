import { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, Camera, Save } from 'lucide-react';
import { useLocation } from 'react-router';
import { userService } from '../../services/userService';

export function ProfilePage() {
  const location = useLocation();
  const role = location.pathname.includes('mangaka') ? 'mangaka' :
    location.pathname.includes('assistant') ? 'assistant' :
      location.pathname.includes('tantou') ? 'tantou' :
        location.pathname.includes('admin') ? 'admin' : 'editorial';

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    avatarUrl: '',
    avatarFile: null,
    avatarPreview: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getProfile();
        if (res) {
          // Dữ liệu profile nằm trong object 'data'
          const data = res.data;
          setProfileData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            bio: data.bio || '',
            avatarUrl: data.avatarUrl || '',
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file)
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append('FirstName', profileData.firstName);
      formData.append('LastName', profileData.lastName);
      formData.append('Phone', profileData.phone);
      formData.append('Bio', profileData.bio);

      if (profileData.avatarFile) {
        formData.append('AvatarFile', profileData.avatarFile);
      }

      await userService.updateProfile(formData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const roleLabels = {
    mangaka: 'Mangaka',
    assistant: 'Assistant',
    tantou: 'Tantou Editor',
    editorial: 'Editorial Board',
    admin: 'Admin',
  };

  return (
    <div className="p-9 space-y-8">
      <div>
        <h1 className='text-sidebar-foreground font-medium text-2xl'>Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-6">
              <div className="relative">
                {profileData.avatarPreview || profileData.avatarUrl ? (
                  <img
                    src={profileData.avatarPreview || profileData.avatarUrl}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground text-2xl">
                    {profileData.firstName?.charAt(0) || ''}
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                >
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
          </>
        )}
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
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save size={18} />
            )}
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
