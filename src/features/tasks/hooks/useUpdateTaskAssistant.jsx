import { useState } from 'react';
import { taskService } from '@/services/taskService';
import { useToast } from '@/shared/hooks/useToast';

export function useUpdateTaskAssistant(taskId, currentAssistantId, currentAssistantName, onReload) {
    const { showAlert } = useToast();

    const [isEditingTaskAssistant, setIsEditingTaskAssistant] = useState(false);
    const [selectedTaskAssistantId, setSelectedTaskAssistantId] = useState("");
    const [taskAssistantList, setTaskAssistantList] = useState([]);
    const [isUpdatingTaskAssistant, setIsUpdatingTaskAssistant] = useState(false);

    const fetchTaskAssistants = async () => {
        try {
            const response = await taskService.getAssistantList("Assistant");
            const data = response?.data || response?.data?.data || [];
            setTaskAssistantList(data);
            return data;
        } catch (error) {
            console.error("Failed to fetch assistant list:", error);
            return [];
        }
    };

    const handleStartEditTaskAssistant = async () => {
        if (isEditingTaskAssistant) {
            setIsEditingTaskAssistant(false);
            return;
        }

        let currentList = taskAssistantList;
        if (currentList.length === 0) {
            currentList = await fetchTaskAssistants();
        }

        const matched = currentList.find(as => 
            (as.fullName || `${as.lastName} ${as.firstName}`.trim()) === currentAssistantName
        );
        setSelectedTaskAssistantId(currentAssistantId || matched?.userId || "");

        setIsEditingTaskAssistant(true);
    };

    const handleSaveTaskAssistant = async () => {
        if (!taskId) {
            showAlert("Task ID does not exist");
            return;
        }

        if (!selectedTaskAssistantId) {
            showAlert("Please select an assistant to save");
            return;
        }

        setIsUpdatingTaskAssistant(true);
        try {
            await taskService.updateTaskAssistant(taskId, selectedTaskAssistantId);
            showAlert("Updated assistant successfully!");

            setIsEditingTaskAssistant(false);

            if (onReload) {
                const matched = taskAssistantList.find(as => as.userId === selectedTaskAssistantId);
                const newName = matched?.fullName || (matched ? `${matched.firstName} ${matched.lastName}`.trim() : "");
                onReload(selectedTaskAssistantId, newName);
            }
        } catch (error) {
            console.error("Failed to update assistant:", error);
            showAlert("Update failed: " + error.message, "error");
        } finally {
            setIsUpdatingTaskAssistant(false);
        }
    };

    const handleCancelEditTaskAssistant = () => {
        setIsEditingTaskAssistant(false);
    };

    return {
        isEditingTaskAssistant,
        setIsEditingTaskAssistant,
        isUpdatingTaskAssistant,
        taskAssistantList,
        selectedTaskAssistantId,
        handleStartEditTaskAssistant,
        handleSaveTaskAssistant,
        handleCancelEditTaskAssistant,
        setSelectedTaskAssistantId
    };
}
