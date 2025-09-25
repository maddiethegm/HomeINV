// src/Models/User.js
import React from 'react';

export const initialUserState = {
    ID: '',
    Username: '',
    Password: '',
    Role: 'user',
    Email: '',
    DisplayName: '',
    AvatarURL: '',
    UITheme: 'light',
    Team: '',
    Bio: '',
    SQL_USER: false
};

export default function useUser(initialUser = initialUserState) {
    const [user, setUser] = React.useState(initialUser);
    
    // Add methods here if needed in the future
    return { user, setUser };
}
