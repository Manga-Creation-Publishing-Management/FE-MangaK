import { useState } from "react";

export function LoginHook() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = (e) => {
        e.preventDefault();
        //logic sign in
        //
        console.log('Sign in clicked', { email, password });
    };

    return (
        { email, password, setEmail, setPassword, showPassword, setShowPassword, handleSignIn }
    )
}