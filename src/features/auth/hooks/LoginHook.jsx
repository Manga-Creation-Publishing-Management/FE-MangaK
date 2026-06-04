import { useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "../../../services/authService";

export function LoginHook() {
    const navigate = useNavigate(); //dùng để đổi đường dẫn cho trang

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
            const res = await authService.Login(email, password);

            localStorage.setItem('accessToken', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            const role = res.data.user.role;
            navigate('/${role}');
        } catch (err) {
            setError(err.message);
        }
        finally {
            setIsLoading(false);//tat loading
        }

    };

    return (
        { email, password, setEmail, setPassword, showPassword, setShowPassword, handleSignIn, navigate, isLoading, error }
    )
}