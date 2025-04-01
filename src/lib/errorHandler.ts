import { useNavigate } from 'react-router-dom';

export const handleError = (error: Error | string, navigate = useNavigate()) => {
  console.error('Error:', error);
  const errorMessage = typeof error === 'string' ? error : error.message;
  navigate('/error', { state: { message: errorMessage } });
};

export const showComingSoon = (navigate = useNavigate()) => {
  navigate('/analytics');
}; 