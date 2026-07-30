import { useEffect, useState } from 'react';
import { seriesService } from '@/services/seriesService';
import { publishingScheduleService } from '@/services/publishingScheduleService';
import { useToast } from '@/shared/hooks/useToast';

export function usePublishingSchedule() {
  const { showAlert } = useToast();
  
  const [showAddSchedule, setShowAddSchedule] = useState(false);

  const [selectedSeries, setSelectedSeries] = useState('');

  const [frequency, setFrequency] = useState('Weekly');

  const [startDate, setStartDate] = useState('');

  const [approvedSeries, setApprovedSeries] = useState([]);

  const [schedules, setSchedules] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [editingScheduleId, setEditingScheduleId] = useState(null);

  const fetchApprovedSeries = async () => {
    try {
      const response = await seriesService.getAllSeries();
      const allSeries = response.data || [];
      
      const approved = allSeries.filter(s => s.status?.toLowerCase() === 'approved');

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

  const fetchSchedules = async () => {
    try {
      const response = await publishingScheduleService.getAllSchedules();
      const dataList = response.data || [];

      const mapped = dataList.map(s => ({
        id: s.scheduleId,
        seriesId: s.seriesId,
        seriesName: s.seriesTitle,
        author: s.mangakaName,
        frequency: s.publishPeriod,
        startDate: s.publishDate ? s.publishDate.split('T')[0] : '',
        nextRelease: s.publishDate ? s.publishDate.split('T')[0] : 'N/A',
        chaptersPublished: 0,
        
        status: s.seriesStatus?.toLowerCase() === 'publishing' ? 'active' : 'inactive',
      }));
      setSchedules(mapped);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  useEffect(() => {
    fetchApprovedSeries();
    fetchSchedules();
  }, []);

  const handleEditClick = (schedule) => {
    setSelectedSeries(schedule.seriesId);
    setFrequency(schedule.frequency || 'Weekly');
    setStartDate(schedule.startDate);
    setEditingScheduleId(schedule.id);
    setIsEditing(true);         
    setShowAddSchedule(true);   
  };

  const handleCloseModal = () => {
    setShowAddSchedule(false);
    setIsEditing(false);
    setSelectedSeries('');
    setFrequency('Weekly');
    setStartDate('');
    setEditingScheduleId(null);
  };

  const handleSaveSchedule = async () => {
    
    if (!selectedSeries || !startDate) {
      showAlert('Please select a series and start date', 'warning');
      return;
    }

    try {
      
      const publishDate = new Date(startDate).toISOString();

      if (isEditing) {
        
        await publishingScheduleService.updateSchedule(editingScheduleId, {
          publishDate,
          publishPeriod: frequency,
        });
        showAlert('Publishing schedule updated successfully!');
      } else {
        
        await publishingScheduleService.createSchedule(selectedSeries, {
          publishDate,
          publishPeriod: frequency,
        });
        showAlert('Publishing schedule created successfully!');
      }
      
      handleCloseModal();

      fetchApprovedSeries();
      fetchSchedules();
    } catch (error) {
      console.error('Failed to save publishing schedule:', error);
      showAlert(error.message || 'Failed to save publishing schedule. Please try again.');
    }
  };

  const handleDeleteConfirm = async (scheduleId) => {
    try {
      await publishingScheduleService.deleteSchedule(scheduleId);
      showAlert('Publishing schedule deleted successfully!');
      
      fetchApprovedSeries();
      fetchSchedules();
    } catch (error) {
      console.error('Failed to delete publishing schedule:', error);
      showAlert(error.message || 'Failed to delete publishing schedule. Please try again.');
    }
  };

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
