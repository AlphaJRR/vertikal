import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface LoginData {
  email: string;
}

interface RegisterData {
  email: string;
  displayName: string;
  handle: string;
  bio?: string;
  tags?: string[];
  verificationCode: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    handle: string;
  };
  token: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Map error messages to user-friendly text
        let errorMessage = 'Login failed. Please try again.';
        
        if (result.message?.includes('not found') || result.message?.includes('Invalid')) {
          errorMessage = 'Account not found. Create one to continue.';
        } else if (result.message?.includes('password') || result.message?.includes('incorrect')) {
          errorMessage = 'Incorrect email or password. Try again.';
        } else if (result.message?.includes('attempts') || result.message?.includes('many')) {
          errorMessage = 'Too many attempts. Please wait and retry.';
        } else if (result.message) {
          errorMessage = result.message;
        }

        throw new Error(errorMessage);
      }

      // Store token
      if (result.data?.token) {
        localStorage.setItem('vertikal_token', result.data.token);
        localStorage.setItem('vertikal_user', JSON.stringify(result.data.user));
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterData): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Map error messages to user-friendly text
        let errorMessage = 'Signup failed. Please try again.';
        
        if (result.message?.includes('already') || result.message?.includes('taken')) {
          if (result.message?.includes('email')) {
            errorMessage = 'Email already in use. Log in instead.';
          } else {
            errorMessage = 'Handle already taken. Please choose another.';
          }
        } else if (result.message?.includes('password') || result.message?.includes('requirements')) {
          errorMessage = 'Password doesn\'t meet requirements.';
        } else if (result.message?.includes('verification') || result.message?.includes('code')) {
          errorMessage = 'Verification needed. Check your inbox.';
        } else if (result.message) {
          errorMessage = result.message;
        }

        throw new Error(errorMessage);
      }

      // Store token
      if (result.data?.token) {
        localStorage.setItem('vertikal_token', result.data.token);
        localStorage.setItem('vertikal_user', JSON.stringify(result.data.user));
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};

export const useLogout = () => {
  const logout = () => {
    localStorage.removeItem('vertikal_token');
    localStorage.removeItem('vertikal_user');
    localStorage.removeItem('vertikal_is_guest');
    // Clear session
    window.location.reload();
  };

  return { logout };
};

