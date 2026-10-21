import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser, UserRole } from '../../data/types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedRole = (localStorage.getItem('careconnect_role') as UserRole) || 'operator';
    const savedUser = localStorage.getItem('careconnect_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        // fallback
      }
    }
    // Default active operator session for the desk dashboard
    return {
      id: 'usr_desk_operator_01',
      email: 'operator@careconnect.in',
      role: savedRole,
    };
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const role = (session.user.user_metadata?.role as UserRole) || 'operator';
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || 'operator@careconnect.in',
            role,
          };
          setUser(authUser);
          localStorage.setItem('careconnect_user', JSON.stringify(authUser));
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const role = (session.user.user_metadata?.role as UserRole) || 'operator';
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || 'operator@careconnect.in',
            role,
          };
          setUser(authUser);
          localStorage.setItem('careconnect_user', JSON.stringify(authUser));
        } else {
          setUser(null);
          localStorage.removeItem('careconnect_user');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) {
          return { error: 'Email or password is incorrect' };
        }
        return {};
      }

      // Mock auth validation
      // Accept demo accounts or any valid email with 6+ char password
      if (!email.includes('@') || pass.length < 4) {
        return { error: 'Email or password is incorrect' };
      }

      const role: UserRole = email.includes('viewer') ? 'viewer' : 'operator';
      const mockUser: AuthUser = {
        id: `usr_${Date.now()}`,
        email,
        role,
      };
      setUser(mockUser);
      localStorage.setItem('careconnect_user', JSON.stringify(mockUser));
      localStorage.setItem('careconnect_role', role);
      return {};
    } catch {
      return { error: 'Email or password is incorrect' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('careconnect_user');
  };

  const setRole = (newRole: UserRole) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem('careconnect_user', JSON.stringify(updated));
      localStorage.setItem('careconnect_role', newRole);
    }
  };

  const role: UserRole = user?.role || 'operator';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
