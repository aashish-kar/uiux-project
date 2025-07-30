import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ShoppingBag, User, LogOut, Crown, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  // Debug logging
  console.log('Navigation - Auth State:', { user, isAuthenticated });
  console.log('Navigation - localStorage token:', localStorage.getItem('token'));
  console.log('Navigation - localStorage user:', localStorage.getItem('user'));

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    toast({
      title: "Successfully signed out",
      description: "You have been logged out of your account.",
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/30 shadow-glass">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-luxury-gradient rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-luxury-glow">
              <div className="w-5 h-5 bg-luxury-white rounded-full shadow-sm"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-playfair text-2xl font-bold text-foreground group-hover:text-accent transition-colors duration-300">watchShop</span>
              <span className="text-xs text-muted-foreground font-inter -mt-1">Luxury</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`relative font-inter font-medium transition-all duration-300 group px-3 py-2 rounded-lg ${
                isActive('/') ? 'text-accent bg-accent/10' : 'text-foreground hover:text-accent hover:bg-accent/5'
              }`}
            >
              Home
              <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full transition-all duration-300 ${
                isActive('/') ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'
              }`}></span>
            </Link>
            <Link 
              to="/collections" 
              className={`relative font-inter font-medium transition-all duration-300 group px-3 py-2 rounded-lg ${
                isActive('/collections') ? 'text-accent bg-accent/10' : 'text-foreground hover:text-accent hover:bg-accent/5'
              }`}
            >
              Collections
              <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full transition-all duration-300 ${
                isActive('/collections') ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'
              }`}></span>
            </Link>
            <Link 
              to="/about" 
              className={`relative font-inter font-medium transition-all duration-300 group px-3 py-2 rounded-lg ${
                isActive('/about') ? 'text-accent bg-accent/10' : 'text-foreground hover:text-accent hover:bg-accent/5'
              }`}
            >
              About
              <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full transition-all duration-300 ${
                isActive('/about') ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'
              }`}></span>
            </Link>
            <Link 
              to="/contact" 
              className={`relative font-inter font-medium transition-all duration-300 group px-3 py-2 rounded-lg ${
                isActive('/contact') ? 'text-accent bg-accent/10' : 'text-foreground hover:text-accent hover:bg-accent/5'
              }`}
            >
              Contact
              <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-accent rounded-full transition-all duration-300 ${
                isActive('/contact') ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'
              }`}></span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Enhanced Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="hover:bg-accent/10 hover:text-accent transition-all duration-300 group rounded-lg">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-luxury-gradient hover:bg-luxury-gradient/90 text-luxury-black font-semibold transition-all duration-300 luxury-hover">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground font-medium">
                    Welcome, {user?.firstName || 'User'}
                  </span>
                </div>
                {user?.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="ghost" className="hover:bg-accent/10 hover:text-accent transition-all duration-300 group rounded-lg">
                      <Crown className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link to="/profile">
                  <Button variant="ghost" size="icon" className="hover:bg-accent/10 hover:text-accent transition-all duration-300 group rounded-lg">
                    <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/wishlist">
                  <Button variant="ghost" size="icon" className={`hover:bg-accent/10 hover:text-accent transition-all duration-300 group relative rounded-lg ${isActive('/wishlist') ? 'text-accent' : ''}`}>
                    <Heart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="hover:bg-accent/10 hover:text-accent transition-all duration-300 group relative rounded-lg">
                    <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-xs flex items-center justify-center text-accent-foreground font-bold opacity-0 scale-75">0</span>
                  </Button>
                </Link>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-accent/10 hover:text-accent transition-all duration-300 group rounded-lg"
                    >
                      <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure you want to logout?</DialogTitle>
                      <DialogDescription>This will end your current session.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogTrigger>
                      <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-lg hover:bg-accent/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 pb-6 border-t border-border/30 animate-fade-in bg-background/50 backdrop-blur-sm rounded-lg -mx-2 px-4 mt-4">
            <div className="flex flex-col space-y-4 mt-6">
              {/* Mobile Search */}
              <div className="mb-4">
                <SearchBar />
              </div>
              
              <Link 
                to="/" 
                className={`font-inter font-medium transition-all duration-300 px-4 py-3 rounded-lg ${
                  isActive('/') ? 'text-accent bg-accent/10' : 'text-foreground hover:text-accent hover:bg-accent/5'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/collections" 
                className={`font-inter font-medium transition-all duration-300 px-4 py-3 rounded-lg ${
                  isActive('/collections') ? 'text-accent bg-accent/10' : 'text-foreground hover:text-accent hover:bg-accent/5'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Collections
              </Link>
              <Link 
                to="/about" 
                className={`font-inter font-medium transition-all duration-300 px-4 py-3 rounded-lg ${
                  isActive('/about') ? 'text-accent bg-accent/10' : 'text-foreground hover:text-accent hover:bg-accent/5'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`font-inter font-medium transition-all duration-300 px-4 py-3 rounded-lg ${
                  isActive('/contact') ? 'text-accent bg-accent/10' : 'text-foreground hover:text-accent hover:bg-accent/5'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/login" 
                    className={`font-inter font-medium transition-all duration-300 px-4 py-3 rounded-lg ${
                      isActive('/login') ? 'text-accent bg-accent/10' : 'text-foreground hover:text-accent hover:bg-accent/5'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className={`font-inter font-medium transition-all duration-300 px-4 py-3 rounded-lg ${
                      isActive('/signup') ? 'text-accent bg-accent/10' : 'text-foreground hover:text-accent hover:bg-accent/5'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 text-sm text-muted-foreground font-medium border-b border-border/30">
                    Welcome, {user?.firstName || 'User'}
                  </div>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className={`font-inter font-medium transition-all duration-300 px-4 py-3 rounded-lg ${
                        isActive('/admin') ? 'text-accent bg-accent/10' : 'text-foreground hover:text-accent hover:bg-accent/5'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Crown className="h-4 w-4 inline mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    className={`font-inter font-medium transition-all duration-300 px-4 py-3 rounded-lg ${
                      isActive('/profile') ? 'text-accent bg-accent/10' : 'text-foreground hover:text-accent hover:bg-accent/5'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Dialog>
                    <DialogTrigger asChild>
                  <button 
                        className="font-inter font-medium transition-all duration-300 px-4 py-3 rounded-lg text-foreground hover:text-accent hover:bg-accent/5 flex items-center space-x-2 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to logout?</DialogTitle>
                        <DialogDescription>This will end your current session.</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogTrigger>
                        <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              
              <div className="flex items-center justify-center space-x-4 pt-4 border-t border-border/30">
                <Link to="/wishlist">
                  <Button variant="ghost" size="icon" className={`hover:text-accent transition-colors duration-300 rounded-lg ${isActive('/wishlist') ? 'text-accent' : ''}`}>
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="hover:text-accent transition-colors duration-300 rounded-lg">
                  <ShoppingBag className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
