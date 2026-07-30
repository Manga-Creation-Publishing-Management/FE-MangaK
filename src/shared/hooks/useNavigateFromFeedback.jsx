import { useNavigate } from 'react-router';

export function useNavigateFromFeedback() {
    const navigate = useNavigate();

    const handleNavigateFromFeedback = (feedback, role) => {
        const normalizedRole = role.toLowerCase();

        if (feedback.mangaTaskId) {
            const taskId = feedback.mangaTaskId;
            navigate(`/${normalizedRole}/tasks/${taskId}`, { state: { role: normalizedRole, taskId } });
            
        }
        
        else if (feedback.chapterId) {
            navigate(`/${normalizedRole}/chapter/${feedback.chapterId}`, { state: { role: normalizedRole, seriesId: feedback.seriesId, chapterId: feedback.chapterId } });
            
        }
        
        else if (feedback.seriesId) {
            navigate(`/${normalizedRole}/series/${feedback.seriesId}`, { state: { role: normalizedRole } });
            
        } else {
            console.warn("Feedback item does not have a recognizable ID for navigation", feedback);
        }
    };

    return { handleNavigateFromFeedback };
}
