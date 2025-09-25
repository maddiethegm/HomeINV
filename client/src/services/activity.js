// useInactivity.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const INACTIVITY_TIMEOUT = 300000; // 5 minutes

function useInactivity() {
  const [isActive, setIsActive] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsActive(false);
      }, INACTIVITY_TIMEOUT);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  });

  useEffect(() => {
    if (!isActive) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [isActive]);
}

export default useInactivity;
