import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { HeaderPage } from './HeaderPage';
import avatarImgDemo from './avatarImgDemo.png';
import { useState } from 'react';

// Đối tượng (Object) dùng để ánh xạ (map) từ tên role (vai trò) hệ thống sang tên hiển thị cho người dùng
const roleDisplayNames = {
  mangaka: "Mangaka",
  assistant: "Assistant",
  tantou: "Tantou Editor",
  editorial: "Editorial Board",
  admin: "Admin",
  reader: "Reader"
};

// Component Layout đóng vai trò là khung xương của ứng dụng sau khi đăng nhập
// Mọi trang bên trong (dashboard, profile,...) đều được render vào bên trong Layout này
export function Layout({ roleName }) {
  // State quản lý phần Header riêng của từng trang (Tiêu đề, phụ đề, nút chức năng)
  // Các trang con (Outlet) có thể cập nhật thông tin này qua context
  const [pageHeader, setPageHeader] = useState(null);
  
  // Lấy tên hiển thị tương ứng với role, nếu không có trong danh sách thì dùng tạm roleName
  const displayRole = roleDisplayNames[roleName] || roleName;

  return (
    // Container chính với chiều cao toàn màn hình (h-screen)
    <div className="flex h-screen w-full overflow-hidden">
      
      {/* Thanh Sidebar (menu bên trái), truyền vào userRole để hiển thị menu tương ứng */}
      <Sidebar userRole={roleName} />
      
      {/* Vùng nội dung chính bên phải */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        
        {/* Header toàn cục nằm trên cùng của khung bên phải */}
        <HeaderPage roleName={displayRole} avatarUrl={avatarImgDemo} />
        
        {/* Phần Header riêng của từng trang con (nếu có được setPageHeader) */}
        {pageHeader && (
          <div className="p-6 m-4 bg-card border border-border rounded-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{pageHeader.title}</h1>
                <p className="text-muted-foreground">{pageHeader.subtitle}</p>
              </div>
              
              {/* Vùng hiển thị các nút thao tác của trang (nếu có) */}
              <div className="flex flex-wrap gap-3">
                {pageHeader.actions}
              </div>
            </div>
          </div>
        )}
        
        {/* Nơi nội dung của các trang con (các route con) được hiển thị (Outlet) */}
        <div className="flex-1 overflow-y-auto p-1 bg-background">
          <Outlet context={{ setPageHeader }} />
        </div>
      </main>
    </div>
  );
}