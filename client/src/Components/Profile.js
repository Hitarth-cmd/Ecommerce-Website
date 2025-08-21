import React, { useMemo } from 'react';

const parseJwt = (token) => {
    try{
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }catch(e){ return null; }
}

const Profile = () => {
    const token = localStorage.getItem('token');
    const payload = useMemo(()=> token ? parseJwt(token) : null, [token]);

    if(!token || !payload){
        return <div style={{ padding: 24 }}>
            <h2>Profile</h2>
            <p>Please login to view your profile.</p>
        </div>
    }

    return (
        <div style={{ padding: 24 }}>
            <h2>My Profile</h2>
            <div>
                <p><b>Phone:</b> {payload.phoneNumber}</p>
                <p><b>Account Type:</b> {payload.accountType}</p>
                <p><b>User Id:</b> {payload.id}</p>
            </div>
        </div>
    )
}

export default Profile;
