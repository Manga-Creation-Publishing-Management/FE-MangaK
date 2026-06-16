import { useEffect, useState } from 'react';
import { seriesService } from '../../services/seriesService';
import { publishingScheduleService } from '../../services/publishingScheduleService';

// Custom hook dùng để quản lý logic của màn hình Lịch Xuất Bản (Publishing Schedule)
export function usePublishingSchedule() {
  // Trạng thái hiển thị modal (popup) thêm/sửa lịch xuất bản
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  
  // Trạng thái lưu ID của bộ truyện đang được chọn để xếp lịch
  const [selectedSeries, setSelectedSeries] = useState('');
  
  // Trạng thái lưu chu kỳ xuất bản (mặc định là 'weekly' - hàng tuần)
  const [frequency, setFrequency] = useState('weekly');
  
  // Trạng thái lưu ngày bắt đầu xuất bản
  const [startDate, setStartDate] = useState('');
  
  // Trạng thái lưu danh sách các bộ truyện đã được duyệt (đủ điều kiện lên lịch)
  const [approvedSeries, setApprovedSeries] = useState([]);
  
  // Trạng thái lưu danh sách toàn bộ các lịch xuất bản đang có
  const [schedules, setSchedules] = useState([]);
  
  // Cờ (flag) xác định xem người dùng đang Tạo mới (false) hay Chỉnh sửa (true)
  const [isEditing, setIsEditing] = useState(false);
  
  // Lưu ID của lịch đang được chỉnh sửa
  const [editingScheduleId, setEditingScheduleId] = useState(null);

  // Hàm gọi API để lấy danh sách các bộ truyện đã được duyệt (status: approved)
  const fetchApprovedSeries = async () => {
    try {
      const response = await seriesService.getAllSeries();
      const allSeries = response.data || [];
      // Lọc ra những truyện có trạng thái là 'approved'
      const approved = allSeries.filter(s => s.status?.toLowerCase() === 'approved');
      
      // Ánh xạ lại cấu trúc dữ liệu cho gọn gàng dễ dùng
      const mapped = approved.map(s => ({
        id: s.seriesId,
        name: s.title,
        author: s.mangakaName
      }));
      setApprovedSeries(mapped);
    } catch (error) {
      console.error('Failed to fetch approved series:', error);
    }
  };

  // Hàm gọi API để lấy danh sách lịch xuất bản
  const fetchSchedules = async () => {
    try {
      const response = await publishingScheduleService.getAllSchedules();
      const dataList = response.data || [];
      
      // Chuyển đổi định dạng dữ liệu, xử lý lại định dạng ngày (cắt bỏ phần giờ T...)
      const mapped = dataList.map(s => ({
        id: s.scheduleId,
        seriesId: s.seriesId,
        seriesName: s.seriesTitle,
        author: s.mangakaName,
        frequency: s.publishPeriod,
        startDate: s.publishDate ? s.publishDate.split('T')[0] : '',
        nextRelease: s.publishDate ? s.publishDate.split('T')[0] : 'N/A',
        chaptersPublished: 0,
        // Xác định trạng thái của lịch đang active hay inactive dựa theo trạng thái truyện
        status: s.seriesStatus?.toLowerCase() === 'publishing' ? 'active' : 'inactive',
      }));
      setSchedules(mapped);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  // Effect chạy 1 lần khi load trang để lấy dữ liệu cần thiết
  useEffect(() => {
    fetchApprovedSeries();
    fetchSchedules();
  }, []);

  // Hàm xử lý khi người dùng nhấn nút Sửa (Edit) một lịch xuất bản có sẵn
  const handleEditClick = (schedule) => {
    setSelectedSeries(schedule.seriesId);
    setFrequency(schedule.frequency || 'weekly');
    setStartDate(schedule.startDate);
    setEditingScheduleId(schedule.id);
    setIsEditing(true);         // Đánh dấu là đang sửa
    setShowAddSchedule(true);   // Mở popup lên
  };

  // Hàm xử lý tắt popup và reset toàn bộ các form nhập liệu
  const handleCloseModal = () => {
    setShowAddSchedule(false);
    setIsEditing(false);
    setSelectedSeries('');
    setFrequency('weekly');
    setStartDate('');
    setEditingScheduleId(null);
  };

  // Hàm xử lý lưu lịch xuất bản (cho cả trường hợp tạo mới và sửa đổi)
  const handleSaveSchedule = async () => {
    // Ràng buộc yêu cầu phải nhập đủ thông tin
    if (!selectedSeries || !startDate) {
      alert('Please select a series and start date');
      return;
    }

    try {
      // Chuẩn hóa định dạng ngày sang ISO chuẩn để gửi cho backend
      const publishDate = new Date(startDate).toISOString();
      
      if (isEditing) {
        // NẾU LÀ SỬA ĐỔI: Gọi API update
        await publishingScheduleService.updateSchedule(editingScheduleId, {
          publishDate,
          publishPeriod: frequency,
        });
        alert('Publishing schedule updated successfully!');
      } else {
        // NẾU LÀ TẠO MỚI: Gọi API create
        await publishingScheduleService.createSchedule(selectedSeries, {
          publishDate,
          publishPeriod: frequency,
        });
        alert('Publishing schedule created successfully!');
      }
      // Lưu xong thì tắt popup
      handleCloseModal();

      // Load lại dữ liệu bảng để hiển thị kết quả mới nhất
      fetchApprovedSeries();
      fetchSchedules();
    } catch (error) {
      console.error('Failed to save publishing schedule:', error);
      alert(error.message || 'Failed to save publishing schedule. Please try again.');
    }
  };

  // Hàm xử lý khi người dùng nhấn nút Xóa (Delete) lịch
  const handleDeleteConfirm = async (scheduleId) => {
    try {
      await publishingScheduleService.deleteSchedule(scheduleId);
      alert('Publishing schedule deleted successfully!');
      // Load lại dữ liệu
      fetchApprovedSeries();
      fetchSchedules();
    } catch (error) {
      console.error('Failed to delete publishing schedule:', error);
      alert(error.message || 'Failed to delete publishing schedule. Please try again.');
    }
  };

  // Trả ra các biến và hàm cần thiết cho component (UI) sử dụng
  return {
    showAddSchedule,
    setShowAddSchedule,
    selectedSeries,
    setSelectedSeries,
    frequency,
    setFrequency,
    startDate,
    setStartDate,
    approvedSeries,
    schedules,
    handleCreateSchedule: handleSaveSchedule,
    isEditing,
    editingScheduleId,
    handleEditClick,
    handleDeleteConfirm,
    handleCloseModal,
  };
}
