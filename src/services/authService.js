const BASE_URL = '/api';

export const authService = {
    async Login(email,password) {
        const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
        //chuyen object thanh chuoi json
        });
        
        if(!response.ok) { //throw neu co loi
            const error = await response.json();
            throw new Error(error.message || 'Login failed, please try again!');
        }

        const data = await response.json();
        return data;
    }
}