import { useNavigate } from 'react-router';

export function useNavigateFromFeedback() {
    const navigate = useNavigate();

    const handleNavigateFromFeedback = (feedback, role) => {
        const normalizedRole = role.toLowerCase();

        // Check if mangaTaskId exists (indicating it's a task)
        if (feedback.mangaTaskId) {
            const taskId = feedback.mangaTaskId;
            // navigate(`/${normalizedRole}/tasks/${taskId}`, { state: { role: normalizedRole, taskId } });
            <Link to={`/${normalizedRole}/tasks/${taskId}`} state={{ role: normalizedRole, taskId }} reloadDocument></Link>
        }
        // Else if chapterId exists (indicating it's a chapter)
        else if (feedback.chapterId) {
            // navigate(`/${normalizedRole}/chapter/${feedback.chapterId}`, { state: { role: normalizedRole, seriesId: feedback.seriesId, chapterId: feedback.chapterId } });
            <Link to={`/${normalizedRole}/chapter/${feedback.chapterId}`} state={{ role: normalizedRole, seriesId: feedback.seriesId, chapterId: feedback.chapterId }} reloadDocument></Link>
        }
        // Else fallback to series details
        else if (feedback.seriesId) {
            // navigate(`/${normalizedRole}/series/${feedback.seriesId}`, { state: { role: normalizedRole } });
            <Link to={`/${normalizedRole}/series/${feedback.seriesId}`} state={{ role: normalizedRole }} reloadDocument></Link>
        } else {
            console.warn("Feedback item does not have a recognizable ID for navigation", feedback);
        }
    };

    return { handleNavigateFromFeedback };
}
