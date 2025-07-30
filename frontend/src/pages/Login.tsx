import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Crown } from 'lucide-react';
import AnimatedWatch from '@/components/AnimatedWatch';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        await login(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "Successfully logged in to your account.",
        });
        // Redirect to the page they were trying to access, or home if none
        const from = location.state?.from || '/';
        navigate(from);
      } catch (error: any) {
        toast({
          title: "Login failed",
          description: error.response?.data?.error || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30">
      <Navigation />
      
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[70vh]">
            
            {/* Left Side - Form */}
            <div className="space-y-6 animate-fade-in-up">
              <div className="text-center lg:text-left">
                <h1 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Welcome <span className="text-accent">Back</span>
                </h1>
                <p className="font-inter text-lg text-muted-foreground">
                  Sign in to your Chronos account to access your luxury timepieces and exclusive benefits.
                </p>
              </div>

              <Card className="border-0 shadow-luxury bg-glass-gradient backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="font-playfair text-xl flex items-center justify-center">
                    Sign In
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-inter font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`pl-10 border-luxury-silver/30 focus:border-accent transition-colors ${
                            errors.email ? 'border-destructive' : ''
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="font-inter font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`pl-10 pr-10 border-luxury-silver/30 focus:border-accent transition-colors ${
                            errors.password ? 'border-destructive' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleInputChange}
                          className="rounded border-luxury-silver/30 text-accent focus:ring-accent"
                        />
                        <Label htmlFor="rememberMe" className="text-sm font-inter">
                          Remember me
                        </Label>
                      </div>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-accent hover:text-accent/80 transition-colors font-inter"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-luxury-gradient hover:bg-luxury-gradient/90 text-luxury-black font-semibold py-3 transition-all duration-300 luxury-hover disabled:opacity-50"
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>

                  <div className="mt-6">
                    <Separator className="my-4" />
                    <div className="text-center">
                      <p className="text-muted-foreground font-inter">
                        Don't have an account?{' '}
                        <Link
                          to="/signup"
                          className="text-accent hover:text-accent/80 transition-colors font-semibold"
                        >
                          Create one
                        </Link>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Visual */}
            <div className="flex justify-center lg:justify-end animate-slide-in-right">
              <div className="relative">
                <AnimatedWatch size={350} />
                
                {/* Floating Elements */}
                <div className="absolute -top-8 -left-8 w-16 h-16 bg-glass-gradient backdrop-blur-sm rounded-full border border-luxury-silver/30 flex items-center justify-center animate-float">
                  <span className="font-inter text-xs text-muted-foreground font-semibold">VIP</span>
                </div>
                
                <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-glass-gradient backdrop-blur-sm rounded-full border border-luxury-gold/30 flex items-center justify-center animate-float" style={{ animationDelay: '2s' }}>
                  <span className="font-inter text-xs text-accent font-semibold">ACCESS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login; 