import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSuccess('If an account with that email exists, a password reset link has been sent.');
      toast({ title: 'Check your email', description: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send reset email.');
      toast({ title: 'Error', description: err.response?.data?.error || 'Failed to send reset email.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30">
      <Navigation />
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="flex justify-center items-center min-h-[50vh]">
            <Card className="w-full max-w-md border-0 shadow-luxury bg-glass-gradient backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="font-playfair text-xl">Forgot Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-inter font-medium">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="border-luxury-silver/30 focus:border-accent transition-colors"
                    />
                  </div>
                  {success && <div className="text-green-600 text-sm text-center">{success}</div>}
                  {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                  <Button type="submit" className="w-full bg-luxury-gradient" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ForgotPassword; 