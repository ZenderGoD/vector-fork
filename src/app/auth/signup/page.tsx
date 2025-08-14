'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthActions } from '@convex-dev/auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertCircle,
  UserPlus,
  Bot,
  Shield,
  Zap,
  Users,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { extractAuthErrorMessage } from '@/lib/auth-error-handler';

export const dynamic = 'force-dynamic';

// Validation functions
const validateEmail = (
  email: string
): { isValid: boolean; message: string } => {
  if (!email) return { isValid: false, message: 'Email is required' };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
};

const validateUsername = (
  username: string
): { isValid: boolean; message: string } => {
  if (!username) return { isValid: false, message: 'Username is required' };
  if (username.length < 3) {
    return {
      isValid: false,
      message: 'Username must be at least 3 characters long',
    };
  }
  if (username.length > 20) {
    return {
      isValid: false,
      message: 'Username must be less than 20 characters',
    };
  }
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      message:
        'Username can only contain letters, numbers, hyphens, and underscores',
    };
  }
  return { isValid: true, message: '' };
};

const validatePassword = (
  password: string
): {
  isValid: boolean;
  message: string;
  strength: 'weak' | 'medium' | 'strong';
} => {
  if (!password)
    return {
      isValid: false,
      message: 'Password is required',
      strength: 'weak',
    };
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long',
      strength: 'weak',
    };
  }
  if (password.length > 128) {
    return {
      isValid: false,
      message: 'Password must be less than 128 characters',
      strength: 'weak',
    };
  }

  // Calculate strength based only on length
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (password.length >= 12) strength = 'strong';
  else if (password.length >= 8) strength = 'medium';

  return { isValid: true, message: '', strength };
};

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Validation states
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    message: '',
  });
  const [usernameValidation, setUsernameValidation] = useState({
    isValid: false,
    message: '',
  });
  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    message: string;
    strength: 'weak' | 'medium' | 'strong';
  }>({ isValid: false, message: '', strength: 'weak' });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { signIn } = useAuthActions();

  // Real-time validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setEmailValidation(validateEmail(email));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [email]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setUsernameValidation(validateUsername(username));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [username]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPasswordValidation(validatePassword(password));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [password]);

  // Check if form is valid
  const isFormValid =
    emailValidation.isValid &&
    usernameValidation.isValid &&
    passwordValidation.isValid;

  const getPasswordStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'weak':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPasswordStrengthText = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'Strong password';
      case 'medium':
        return 'Medium strength';
      case 'weak':
        return 'Weak password';
      default:
        return '';
    }
  };

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation check
    const finalEmailValidation = validateEmail(email);
    const finalUsernameValidation = validateUsername(username);
    const finalPasswordValidation = validatePassword(password);

    setEmailValidation(finalEmailValidation);
    setUsernameValidation(finalUsernameValidation);
    setPasswordValidation(finalPasswordValidation);

    if (
      !finalEmailValidation.isValid ||
      !finalUsernameValidation.isValid ||
      !finalPasswordValidation.isValid
    ) {
      setError('Please fix the validation errors above');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('name', username);
      formData.append('flow', 'signUp');

      await signIn('password', formData);

      router.refresh();
      router.push(redirectTo);
    } catch (error) {
      console.error('Sign up error:', error);
      setError(extractAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const getFieldStatus = (
    validation: { isValid: boolean; message: string },
    value: string
  ) => {
    if (!value) return 'default';
    return validation.isValid ? 'valid' : 'error';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case 'error':
        return <XCircle className='h-4 w-4 text-red-500' />;
      default:
        return null;
    }
  };

  const getInputClassName = (status: string) => {
    const baseClasses = 'transition-colors duration-200';
    switch (status) {
      case 'valid':
        return `${baseClasses} border-green-500 focus:border-green-500 focus:ring-green-500/20`;
      case 'error':
        return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500/20`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800'>
      <div className='flex min-h-screen'>
        {/* Left Branding Panel */}
        <div className='relative hidden overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 lg:flex lg:w-1/2'>
          {/* Background Pattern */}
          <div className='absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-blue-600/20 to-purple-600/20' />
          <div
            className='absolute inset-0 bg-repeat opacity-50'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className='relative flex w-full flex-col justify-center px-12 xl:px-16'>
            <div className='max-w-lg space-y-12'>
              {/* Logo & Brand */}
              <div className='space-y-6'>
                <div className='flex items-center space-x-4'>
                  <div className='relative'>
                    <div className='absolute inset-0 rounded-2xl bg-white/20 blur-xl' />
                    <div className='relative rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm'>
                      <Bot className='h-8 w-8 text-white' />
                    </div>
                  </div>
                  <div>
                    <h1 className='text-3xl font-bold tracking-tight text-white'>
                      AIKP
                    </h1>
                    <p className='text-sm font-medium text-slate-300'>
                      AI Assistant Platform
                    </p>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h2 className='text-4xl leading-tight font-bold text-white xl:text-5xl'>
                    Join AIKP Today
                  </h2>
                  <p className='text-xl leading-relaxed font-light text-slate-200'>
                    Create your account and start managing your projects with
                    AI-powered insights.
                  </p>
                </div>

                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20'>
                      <Shield className='h-4 w-4 text-emerald-400' />
                    </div>
                    <span className='text-sm text-slate-300'>
                      Secure authentication
                    </span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20'>
                      <Zap className='h-4 w-4 text-blue-400' />
                    </div>
                    <span className='text-sm text-slate-300'>
                      Real-time collaboration
                    </span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20'>
                      <Users className='h-4 w-4 text-purple-400' />
                    </div>
                    <span className='text-sm text-slate-300'>
                      Team management
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className='flex w-full items-center justify-center lg:w-1/2'>
          <div className='w-full max-w-md space-y-8 px-4'>
            {/* Header */}
            <div className='text-center'>
              <h1 className='text-3xl font-bold tracking-tight'>
                Create Account
              </h1>
              <p className='text-muted-foreground mt-2'>
                Get started with your free account
              </p>
            </div>

            {/* Form Card */}
            <Card className='border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/80 shadow-xl backdrop-blur'>
              <CardHeader className='space-y-1'>
                <CardTitle className='text-2xl'>Sign up</CardTitle>
                <CardDescription>
                  Enter your details to create your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSignUp} className='space-y-4' noValidate>
                  {error && (
                    <Alert variant='destructive'>
                      <AlertCircle className='h-4 w-4' />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className='space-y-2'>
                    <Label htmlFor='email' className='flex items-center gap-2'>
                      Email
                      {emailValidation.isValid && (
                        <CheckCircle className='h-4 w-4 text-green-500' />
                      )}
                    </Label>
                    <div className='relative'>
                      <Input
                        id='email'
                        type='email'
                        placeholder='you@example.com'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && emailValidation.isValid) {
                            e.preventDefault();
                            document.getElementById('username')?.focus();
                          }
                        }}
                        disabled={loading}
                        required
                        aria-describedby={
                          email && emailValidation.message
                            ? 'email-error'
                            : undefined
                        }
                        className={getInputClassName(
                          getFieldStatus(emailValidation, email)
                        )}
                      />
                      {email &&
                        getStatusIcon(
                          getFieldStatus(emailValidation, email)
                        ) && (
                          <div className='absolute top-1/2 right-3 -translate-y-1/2'>
                            {getStatusIcon(
                              getFieldStatus(emailValidation, email)
                            )}
                          </div>
                        )}
                    </div>
                    {email && emailValidation.message && (
                      <p
                        id='email-error'
                        className={`text-sm ${emailValidation.isValid ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {emailValidation.message}
                      </p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='username'
                      className='flex items-center gap-2'
                    >
                      Username
                      {usernameValidation.isValid && (
                        <CheckCircle className='h-4 w-4 text-green-500' />
                      )}
                    </Label>
                    <div className='relative'>
                      <Input
                        id='username'
                        type='text'
                        placeholder='your-username'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        onFocus={() => setFocusedField('username')}
                        onBlur={() => setFocusedField(null)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && usernameValidation.isValid) {
                            e.preventDefault();
                            document.getElementById('password')?.focus();
                          }
                        }}
                        disabled={loading}
                        required
                        aria-describedby={
                          username && usernameValidation.message
                            ? 'username-error'
                            : undefined
                        }
                        className={getInputClassName(
                          getFieldStatus(usernameValidation, username)
                        )}
                      />
                      {username &&
                        getStatusIcon(
                          getFieldStatus(usernameValidation, username)
                        ) && (
                          <div className='absolute top-1/2 right-3 -translate-y-1/2'>
                            {getStatusIcon(
                              getFieldStatus(usernameValidation, username)
                            )}
                          </div>
                        )}
                    </div>
                    {username && usernameValidation.message && (
                      <p
                        id='username-error'
                        className={`text-sm ${usernameValidation.isValid ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {usernameValidation.message}
                      </p>
                    )}
                    <p className='text-muted-foreground text-xs'>
                      Only letters, numbers, hyphens, and underscores allowed
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='password'
                      className='flex items-center gap-2'
                    >
                      Password
                      {passwordValidation.isValid && (
                        <CheckCircle className='h-4 w-4 text-green-500' />
                      )}
                    </Label>
                    <div className='relative'>
                      <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && isFormValid) {
                            e.preventDefault();
                            const submitButton = document.querySelector(
                              'button[type="submit"]'
                            ) as HTMLButtonElement;
                            submitButton?.click();
                          }
                        }}
                        disabled={loading}
                        required
                        aria-describedby={
                          password &&
                          (passwordValidation.message ||
                            passwordValidation.isValid)
                            ? 'password-info'
                            : undefined
                        }
                        className={getInputClassName(
                          getFieldStatus(passwordValidation, password)
                        )}
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors'
                        disabled={loading}
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {password && (
                      <div id='password-info' className='space-y-1'>
                        {passwordValidation.message && (
                          <p
                            className={`text-sm ${passwordValidation.isValid ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {passwordValidation.message}
                          </p>
                        )}
                        {passwordValidation.isValid && (
                          <div className='space-y-2'>
                            <p
                              className={`text-sm ${getPasswordStrengthColor(passwordValidation.strength)}`}
                            >
                              {getPasswordStrengthText(
                                passwordValidation.strength
                              )}
                            </p>
                            <div className='h-2 w-full rounded-full bg-gray-200'>
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  passwordValidation.strength === 'weak'
                                    ? 'w-1/3 bg-red-500'
                                    : passwordValidation.strength === 'medium'
                                      ? 'w-2/3 bg-yellow-500'
                                      : 'w-full bg-green-500'
                                }`}
                                role='progressbar'
                                aria-valuenow={
                                  passwordValidation.strength === 'weak'
                                    ? 33
                                    : passwordValidation.strength === 'medium'
                                      ? 66
                                      : 100
                                }
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`Password strength: ${passwordValidation.strength}`}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <p className='text-muted-foreground text-xs'>
                      Must be at least 6 characters long
                    </p>
                  </div>

                  <Button
                    type='submit'
                    className='w-full'
                    disabled={loading || !isFormValid}
                  >
                    {loading && (
                      <UserPlus className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    {loading ? 'Creating account...' : 'Create account'}
                  </Button>

                  {loading && (
                    <div className='text-center'>
                      <div className='text-muted-foreground inline-flex items-center gap-2 text-sm'>
                        <div className='bg-primary h-2 w-2 animate-bounce rounded-full' />
                        <div
                          className='bg-primary h-2 w-2 animate-bounce rounded-full'
                          style={{ animationDelay: '0.1s' }}
                        />
                        <div
                          className='bg-primary h-2 w-2 animate-bounce rounded-full'
                          style={{ animationDelay: '0.2s' }}
                        />
                        <span>Setting up your account...</span>
                      </div>
                    </div>
                  )}
                </form>

                <div className='mt-6 text-center text-sm'>
                  <span className='text-muted-foreground'>
                    Already have an account?{' '}
                  </span>
                  <Link
                    href='/auth/login'
                    className='text-primary font-medium hover:underline'
                  >
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen w-full items-center justify-center'>
          <div className='text-2xl font-semibold'>Loading...</div>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
