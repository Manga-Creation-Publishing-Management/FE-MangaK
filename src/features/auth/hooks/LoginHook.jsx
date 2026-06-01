import { useState } from "react";
import { useNavigate } from "react-router";

export function LoginHook() {
    const navigate = useNavigate(); //dùng để đổi đường dẫn cho trang

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = (e) => {
        e.preventDefault();
        //logic sign in
        //demo để vào mangaka CHỨ CHƯA CÓ ĐIỀU KIỆN LOGIC GÌ HẾT
        navigate('/mangaka');

        // console.log('Sign in clicked', { email, password });
    };

    return (
        { email, password, setEmail, setPassword, showPassword, setShowPassword, handleSignIn, navigate }
    )
}