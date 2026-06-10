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
            const res = await authService.login(email, password);
            console.log("Login API Response:", res);

            if (!res || typeof res !== "object") {
                throw new Error(`Response from server is not a valid JSON object. Received: ${res}`);
            }

            // Extract token supporting different common namings (token, accessToken) in flat or nested objects
            const token = res.token || res.accessToken || res.data?.token || res.data?.accessToken;

            // Extract or build user object
            let user = res.user || res.data?.user;

            // If the user object is not nested, check if role is present directly on the response or response.data (flat structure)
            if (!user) {
                const source = res.data || res;
                if (source && source.role) {
                    user = {
                        role: source.role,
                        email: source.email || email,
                        name: source.name || source.fullName || ""
                    };
                }
            }

            if (!token || !user) {
                console.error("Failed to parse login response:", res);
                const keys = Object.keys(res).join(", ");
                const nestedDataKeys = res.data ? ` (data: [${Object.keys(res.data).join(", ")}])` : "";
                throw new Error(`Invalid response structure. Received keys: [${keys}]${nestedDataKeys}. Expected 'token'/'accessToken' and 'user'/'role'.`);
            }

            localStorage.setItem('mangak-token', token);
            localStorage.setItem('accessToken', token);
            localStorage.setItem('user', JSON.stringify(user));

            const rolePathMap = {
                mangaka: 'mangaka',
                assistant: 'assistant',
                tantou: 'tantouEditor',
                tantoueditor: 'tantouEditor',
                editorial: 'editorialBoard',
                editorialboard: 'editorialBoard',
                admin: 'admin',
                reader: 'reader',
            };
            const role = (user.role || '').toLowerCase();
            const rolePath = rolePathMap[role] || role;
            navigate(`/${rolePath}`);
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