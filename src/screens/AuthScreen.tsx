import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold-100 opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-earth-100 opacity-60 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-400 mb-4 shadow-lg">
            <Icon name="Sparkles" size={32} className="text-earth-900" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-earth-900">Wardrobe AI</h1>
          <p className="text-earth-500 mt-2">Your personal AI stylist</p>
        </div>

        <div className="card p-8 animate-slide-up">
          <div className="flex gap-1 bg-earth-50 rounded-full p-1 mb-6">
            <button
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${mode === 'signin' ? 'bg-white text-earth-900 shadow-sm' : 'text-earth-500'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-all ${mode === 'signup' ? 'bg-white text-earth-900 shadow-sm' : 'text-earth-500'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
                className="input"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 border border-red-100">
                {error}
              </div>
            )}

            <Button type="submit" fullWidth size="lg" loading={loading}>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-xs text-earth-400 mt-6">
            {mode === 'signup' ? 'Already have an account? ' : 'New here? '}
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }}
              className="text-gold-600 font-medium hover:underline"
            >
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
