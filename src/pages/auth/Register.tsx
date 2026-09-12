import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '@/hooks/useAuth';
import type { UserCreate } from '@/types/auth';

export default function Register() {
  const registerMutation = useRegister();
  
  const [formData, setFormData] = useState<UserCreate>({
    user_email: '',
    password: '',
    full_name: '',
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    registerMutation.mutate(formData, {
      onError: (error: any) => {
        const msg = error.response?.data?.detail?.[0]?.msg || 'Registration failed. Please try again.';
        setErrorMsg(msg);
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: UserCreate) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Create an account</h2>
        <p className="text-sm text-muted-foreground font-mono">
          Join your workspace team
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            placeholder="Alice Manager"
            value={formData.full_name || ''}
            onChange={handleChange}
            disabled={registerMutation.isPending}
          />
        </div>
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
            disabled={registerMutation.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            disabled={registerMutation.isPending}
          />
        </div>

        {errorMsg && (
          <div className="text-sm text-destructive font-medium p-3 bg-destructive/10 rounded-md border border-destructive/20">
            {errorMsg}
          </div>
        )}

        <Button type="submit" className="w-full mt-2" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary underline underline-offset-4 hover:text-accent">
          Sign in
        </Link>
      </div>
    </div>
  );
}
