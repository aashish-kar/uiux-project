import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-luxury-black text-luxury-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-luxury-gradient rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-luxury-white rounded-full"></div>
              </div>
              <span className="font-playfair text-2xl font-bold">watchShop</span>
            </div>
            <p className="font-inter text-sm text-luxury-silver">
              Crafting exceptional timepieces since 1994. Each watch embodies our commitment to precision, elegance, and timeless design.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-bold">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block font-inter text-sm text-luxury-silver hover:text-luxury-gold transition-colors">Collections</a>
              <a href="#" className="block font-inter text-sm text-luxury-silver hover:text-luxury-gold transition-colors">About Us</a>
              <a href="#" className="block font-inter text-sm text-luxury-silver hover:text-luxury-gold transition-colors">Contact</a>
              <a href="#" className="block font-inter text-sm text-luxury-silver hover:text-luxury-gold transition-colors">Support</a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-bold">Services</h3>
            <div className="space-y-2">
              <a href="#" className="block font-inter text-sm text-luxury-silver hover:text-luxury-gold transition-colors">Watch Repair</a>
              <a href="#" className="block font-inter text-sm text-luxury-silver hover:text-luxury-gold transition-colors">Authentication</a>
              <a href="#" className="block font-inter text-sm text-luxury-silver hover:text-luxury-gold transition-colors">Custom Engraving</a>
              <a href="#" className="block font-inter text-sm text-luxury-silver hover:text-luxury-gold transition-colors">Warranty</a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-playfair text-lg font-bold">Stay Connected</h3>
            <p className="font-inter text-sm text-luxury-silver">
              Subscribe to receive exclusive offers and the latest news about our timepieces.
            </p>
            <div className="space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-luxury-black-light border border-luxury-silver/30 rounded text-sm font-inter focus:outline-none focus:border-luxury-gold"
              />
              <Button className="w-full bg-luxury-gradient hover:shadow-luxury-glow transition-all duration-300">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-luxury-silver/20 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="font-inter text-sm text-luxury-silver">
              © 2025 watchShop. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="font-inter text-sm text-luxury-silver hover:text-luxury-gold transition-colors">Privacy Policy</a>
            <a href="#" className="font-inter text-sm text-luxury-silver hover:text-luxury-gold transition-colors">Terms of Service</a>
            <a href="#" className="font-inter text-sm text-luxury-silver hover:text-luxury-gold transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;