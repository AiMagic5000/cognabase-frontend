// Security utilities for input validation
export const validateProjectName = (name: string): boolean => {
  const validPattern = /^[a-z0-9-]+$/;
  return validPattern.test(name) && name.length >= 3 && name.length <= 30;
};

export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
};

// Rate limiting helper
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const attempts = new Map<string, number[]>();

  return (key: string): boolean => {
    const now = Date.now();
    const userAttempts = attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxRequests) {
      return false;
    }

    recentAttempts.push(now);
    attempts.set(key, recentAttempts);
    return true;
  };
};
