import { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, Camera, Save, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { useLocation } from 'react-router';
import { userService } from '../../services/userService';

export function ProfilePage() {
  // Lấy thông tin đường dẫn hiện tại từ react-router để xác định vai trò (role) của người dùng
  const location = useLocation();
  
  // Dựa vào đường dẫn (URL) để xác định vai trò của người dùng hiện tại
  // Ví dụ: nếu URL có chứa 'mangaka' thì role là 'mangaka'
  const role = location.pathname.includes('mangaka') ? 'mangaka' :
    location.pathname.includes('assistant') ? 'assistant' :
      location.pathname.includes('tantou') ? 'tantou' :
        location.pathname.includes('admin') ? 'admin' : 'editorial';

  // Khởi tạo state để lưu trữ dữ liệu hồ sơ người dùng
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    avatarUrl: '', // URL ảnh đại diện hiện tại từ server
    avatarFile: null, // File ảnh mới được người dùng chọn để upload
    avatarPreview: null, // URL tạm thời để hiển thị trước (preview) ảnh vừa chọn
  });
  
  // State để quản lý trạng thái đang tải dữ liệu (loading)
  const [isLoading, setIsLoading] = useState(true);
  
  // State để quản lý trạng thái đang lưu dữ liệu
  const [isSaving, setIsSaving] = useState(false);
  
  // State quản lý hiển thị các modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Dùng useRef để tạo tham chiếu đến thẻ <input type="file"> ẩn
  // Giúp kích hoạt việc chọn file khi click vào nút hoặc ảnh đại diện
  const fileInputRef = useRef(null);

  // useEffect này chạy một lần duy nhất khi component được render lần đầu (do dependency array là [])
  useEffect(() => {
    // Hàm bất đồng bộ để gọi API lấy thông tin profile từ server
    const fetchProfile = async () => {
      try {
        const res = await userService.getProfile();
        if (res) {
          // Dữ liệu profile nằm trong object 'data' trả về từ API
          const data = res.data;
          // Cập nhật state profileData với dữ liệu lấy được
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
        // Tắt trạng thái loading bất kể thành công hay thất bại
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Hàm xử lý sự kiện khi người dùng chọn một file ảnh mới
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData, // Giữ nguyên các thông tin khác
        avatarFile: file, // Lưu file để sau này gửi lên server
        avatarPreview: URL.createObjectURL(file) // Tạo URL tạm thời để xem trước ảnh
      });
    }
  };

  // Hàm dùng để mô phỏng thao tác click vào thẻ input file bị ẩn
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Hàm xử lý khi người dùng nhấn nút "Save Profile"
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true); // Bật trạng thái đang lưu
      setShowConfirmModal(false); // Ẩn modal xác nhận
      
      // Sử dụng FormData để có thể gửi cả dữ liệu text và file (ảnh)
      const formData = new FormData();
      formData.append('FirstName', profileData.firstName);
      formData.append('LastName', profileData.lastName);
      formData.append('Phone', profileData.phone);
      formData.append('Bio', profileData.bio);

      // Nếu có chọn ảnh mới thì mới thêm vào FormData
      if (profileData.avatarFile) {
        formData.append('AvatarFile', profileData.avatarFile);
      }

      // Gọi API để cập nhật profile
      await userService.updateProfile(formData);
      // Hiện modal thông báo thành công thay vì alert
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile: ' + error.message);
    } finally {
      setIsSaving(false); // Tắt trạng thái đang lưu
    }
  };

  // Object dùng để map từ mã role sang tên hiển thị thân thiện với người dùng
  const roleLabels = {
    mangaka: 'Mangaka',
    assistant: 'Assistant',
    tantou: 'Tantou Editor',
    editorial: 'Editorial Board',
    admin: 'Admin',
  };

  return (
    <div className="p-9 space-y-8">
      {/* Tiêu đề trang */}
      <div>
        <h1 className='text-sidebar-foreground font-medium text-2xl'>Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
      </div>

      {/* Phần hiển thị và thay đổi Ảnh đại diện (Avatar) */}
      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        {isLoading ? (
          // Hiển thị vòng tròn loading khi đang lấy dữ liệu
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-6">
              <div className="relative">
                {/* Ưu tiên hiển thị ảnh preview (nếu vừa chọn file mới), nếu không thì hiển thị ảnh từ URL */}
                {profileData.avatarPreview || profileData.avatarUrl ? (
                  <img
                    src={profileData.avatarPreview || profileData.avatarUrl}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  // Hiển thị avatar mặc định (chữ cái đầu của tên) nếu không có ảnh
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-primary-foreground text-2xl">
                    {profileData.firstName?.charAt(0) || ''}
                  </div>
                )}
                
                {/* Input file bị ẩn, được dùng để mở hộp thoại chọn file */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                
                {/* Nút bấm để kích hoạt chọn ảnh (gọi hàm triggerFileInput) */}
                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <Camera size={16} />
                </button>
              </div>

              {/* Thông tin hiển thị tóm tắt: Tên, Vai trò và Trạng thái */}
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

      {/* Phần form để chỉnh sửa Thông tin cá nhân (Personal Information) */}
      <div className="bg-card border border-border rounded-xl p-8 space-y-6">
        <h2>Personal Information</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Input cho First Name */}
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

          {/* Input cho Last Name */}
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

          {/* Input cho Email Address */}
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

          {/* Input cho Phone Number */}
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

        {/* Input cho Bio (Tiểu sử) */}
        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm text-muted-foreground">Bio</label>
          <textarea
            id="bio"
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            className="w-full px-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary min-h-24 resize-none"
          />
        </div>

        {/* Nút lưu profile */}
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={isSaving} // Vô hiệu hóa nút khi đang lưu để tránh click nhiều lần
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSaving ? (
              // Icon loading hiển thị khi đang lưu
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              // Icon save hiển thị bình thường
              <Save size={18} />
            )}
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md p-6 rounded-xl border border-border shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-full">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-semibold">Xác nhận cập nhật</h3>
              </div>
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mt-4 text-muted-foreground">
              Bạn có chắc chắn muốn cập nhật thông tin hồ sơ không?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-sm p-6 rounded-xl border border-border shadow-lg flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cập nhật thành công!</h3>
            <p className="text-muted-foreground mb-6">
              Thông tin hồ sơ của bạn đã được cập nhật thành công.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
