// src/services/navigationHelper.js
import { useNavigate } from 'react-router-dom';

const useRedirect = () => {
    const navigate = useNavigate();
    return (to, options) => navigate(to, options);
};

export default useRedirect;
