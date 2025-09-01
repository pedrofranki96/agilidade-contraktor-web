import axios from 'axios';
import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'auth_token';
const COOKIE_OPTIONS = {
  secure: true,
  sameSite: 'strict' as const,
  expires: 7 // 7 days
};

export const authService = {
  async login(password: string): Promise<boolean> {
    try {
      const response = await axios.post('/auth/login', { password });
      const { access_token } = response.data;
      
      if (access_token) {
        Cookies.set(AUTH_TOKEN_KEY, access_token, COOKIE_OPTIONS);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  },

  logout(): void {
    Cookies.remove(AUTH_TOKEN_KEY);
  },

  getToken(): string | undefined {
    return Cookies.get(AUTH_TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};
