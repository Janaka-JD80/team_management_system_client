import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/useAuth';
import type { UserLogin } from '@/types/auth';

export default function Login() {
  const loginMutation = useLogin();
  
  const [formData, setFormData] = useState<UserLogin>({
    user_email: '',
    password: '',
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    loginMutation.mutate(formData, {
      onError: (error: any) => {
        const msg = error.response?.data?.detail?.[0]?.msg || 'Failed to login. Please check your credentials.';
        setErrorMsg(msg);
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: UserLogin) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground font-mono">
          Enter your credentials to access your workspace
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="user_email">Email</Label>
          <Input
            id="user_email"
            name="user_email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.user_email}
            onChange={handleChange}
            disabled={loginMutation.isPending}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            disabled={loginMutation.isPending}
          />
        </div>

        {errorMsg && (
          <div className="text-sm text-destructive font-medium p-3 bg-destructive/10 rounded-md border border-destructive/20">
            {errorMsg}
          </div>
        )}

        <Button type="submit" className="w-full mt-2" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-primary underline underline-offset-4 hover:text-accent">
          Sign up
        </Link>
      </div>
    </div>
  );
}
