import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturedCollections from '@/components/FeaturedCollections';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0e7ef] via-[#3b4a5a] to-[#1e293b] relative overflow-x-hidden">
      {/* Decorative pattern overlay */}
      <div className="pointer-events-none select-none fixed inset-0 z-0 opacity-10" style={{backgroundImage: 'url(https://www.transparenttextures.com/patterns/cubes.png)'}} />
      {/* Nepal-inspired Hero Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: 'linear-gradient(120deg, rgba(30,41,59,0.10) 0%, rgba(30,41,59,0.18) 100%)',
        mixBlendMode: 'multiply',
      }} />
      <Navigation />
      <HeroSection />
      <FeaturedCollections />
      <Footer />
    </div>
  );
};

export default Index;
