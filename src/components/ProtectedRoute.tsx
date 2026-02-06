import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
}

/**
 * ProtectedRoute: Handles authentication and profile checks with proper loading states
 * Prevents race conditions by waiting for all data to load before rendering or redirecting
 * IMPORTANT: All navigate() calls are inside useEffect to avoid render-phase state updates
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireProfile = false 
}) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, error: profileError } = useProfile();

  console.log('ProtectedRoute state:', {
    authLoading,
    profileLoading,
    user: user?.id,
    profile: profile?.id,
    requireProfile,
    profileError: profileError?.message,
  });

  // Handle authentication redirects (NOT authenticated → /auth)
  useEffect(() => {
    // Only check after auth loading is complete
    if (!authLoading && !user) {
      console.log('No user found, redirecting to /auth');
      navigate('/auth', { replace: true });
    }
  }, [authLoading, user, navigate]);

  // Handle profile requirement redirects (Requires profile but doesn't have → /onboarding)
  // IMPORTANT: Do NOT redirect if there's an error - let user retry instead
  useEffect(() => {
    // Only check after both auth and profile loading are complete AND no error exists
    if (!authLoading && !profileLoading && !profileError && user && requireProfile && !profile) {
      console.log('Profile required but missing, redirecting to /onboarding');
      navigate('/onboarding', { replace: true });
    }
  }, [authLoading, profileLoading, profileError, user, requireProfile, profile, navigate]);

  // Show loading spinner while auth is loading
  if (authLoading) {
    console.log('Auth loading, showing spinner...');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated, don't render anything (useEffect will handle redirect)
  if (!user) {
    console.log('Not authenticated, waiting for redirect...');
    return null;
  }

  // Show loading spinner while profile is loading (critical to prevent race condition)
  if (profileLoading) {
    console.log('Profile loading, showing spinner...');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If there's an error loading profile, show error screen with retry button
  if (profileError) {
    console.log('Profile error:', profileError.message);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">خطأ في الاتصال</h2>
            <p className="text-muted-foreground mb-6">
              حدث خطأ أثناء تحميل ملفك الشخصي. يرجى المحاولة مرة أخرى.
            </p>
            <p className="text-sm text-muted-foreground mb-6 bg-secondary/50 p-3 rounded">
              {profileError.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-gold hover:bg-gold/90 text-primary-foreground font-semibold rounded-xl transition-all"
            >
              إعادة محاولة الاتصال
            </button>
            <button
              onClick={() => navigate('/auth', { replace: true })}
              className="w-full py-2 mt-3 bg-secondary hover:bg-secondary/80 text-foreground font-semibold rounded-xl transition-all"
            >
              العودة إلى تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If route requires profile but don't have it, don't render anything (useEffect will handle redirect)
  if (requireProfile && !profile) {
    console.log('Profile required but missing, waiting for redirect...');
    return null;
  }

  // All checks passed, render children
  console.log('All checks passed, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
