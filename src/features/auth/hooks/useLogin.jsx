import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useToast } from '@/shared/hooks/useToast';
import { authService } from '@/services/authService';

export function useLogin() {
    const navigate = useNavigate(); 
    const { showAlert } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [isLoading, setIsLoading] = useState(false);       
    const [error, setError] = useState(null);                

    const handleSignIn = async (e) => {
        e.preventDefault(); 
        setError(null);     
        setIsLoading(true); 

        try {
            
            const res = await authService.login(email, password);

            if (!res || typeof res !== "object" || !res.success) {
                throw new Error(res?.message || "Login failed on server.");
            }

            const data = res.data;
            if (!data) {
                throw new Error("No data returned in response.");
            }

            const { accessToken, refreshToken, userId, email: userEmail, firstName, lastName, role } = data;

            if (!accessToken || !role) {
                throw new Error("Missing accessToken or role in response data.");
            }

            const user = {
                id: userId,
                email: userEmail || email,
                role: role,
                name: `${firstName || ''} ${lastName || ''}`.trim()
            };

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken || '');
            localStorage.setItem('user', JSON.stringify(user));

            const rolePathMap = {
                mangaka: 'mangaka',
                assistant: 'assistant',
                tantou: 'tantou',
                editorial: 'editorial',
                admin: 'admin',
                reader: 'reader',
            };

            const userRoleKey = (user.role || '').toLowerCase();
            const rolePath = rolePathMap[userRoleKey] || userRoleKey;

            showAlert("Login successfully!");
            navigate(`/${rolePath}`);

        } catch (err) {
            
            showAlert("Login failed! Please try again later.");
            setError(err.message);
        }
        finally {
            setIsLoading(false); 
        }
    };

    return (
        { email, password, setEmail, setPassword, showPassword, setShowPassword, handleSignIn, navigate, isLoading, error }
    )
}
