import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AnimatedWatch from './AnimatedWatch';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30">
      {/* Background Image with Enhanced Parallax */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transition-transform duration-1000"
        style={{ 
          backgroundImage: `url(https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&h=1080&fit=crop)`,
          transform: 'scale(1.1)',
        }}
      />
      
      {/* Enhanced Overlay with Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent animate-shimmer opacity-30" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="font-playfair text-5xl md:text-7xl font-bold text-foreground leading-tight">
                Crafted
                <span className="block text-accent"> Elegance</span>
              </h1>
              <p className="font-playfair text-xl md:text-2xl text-muted-foreground italic">
                Timeless Precision
              </p>
            </div>
            
            <p className="font-inter text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover the finest Collection. Each watch embodies generations of horological excellence and uncompromising craftsmanship.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/collections">
                <Button 
                  size="lg" 
                  className="bg-luxury-gradient hover:shadow-luxury-glow transition-all duration-300 font-inter font-semibold px-8 py-6 text-lg hover:scale-105 transform group"
                >
                  <span className="group-hover:tracking-wider transition-all duration-300">Explore Collection</span>
                </Button>
              </Link>
              <Link to="/customization">
              <Button 
                variant="outline" 
                size="lg"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 font-inter font-semibold px-8 py-6 text-lg hover:scale-105 transform group relative overflow-hidden"
              >
                <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">Customization</span>
                <div className="absolute inset-0 bg-luxury-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/30">
              <div className="text-center lg:text-left">
                <div className="font-playfair text-3xl font-bold text-accent">150+</div>
                <div className="font-inter text-sm text-muted-foreground">Years of Heritage</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-playfair text-3xl font-bold text-accent">50K+</div>
                <div className="font-inter text-sm text-muted-foreground">Satisfied Collectors</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-playfair text-3xl font-bold text-accent">∞</div>
                <div className="font-inter text-sm text-muted-foreground">Timeless Design</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Animated Watch */}
          <div className="flex justify-center lg:justify-end animate-slide-in-right">
            <div className="relative">
              <AnimatedWatch size={400} />
              
              
              
              {/* Additional Floating Particles */}
              <div className="absolute top-1/4 -left-12 w-3 h-3 bg-accent/30 rounded-full animate-float opacity-60" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-1/3 -right-6 w-2 h-2 bg-luxury-gold/40 rounded-full animate-float opacity-50" style={{ animationDelay: '3s' }}></div>
              <div className="absolute top-3/4 left-1/4 w-4 h-4 bg-luxury-silver/20 rounded-full animate-float opacity-40" style={{ animationDelay: '4s' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      
    </section>
  );
};

export default HeroSection;
