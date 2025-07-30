import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AnimatedWatch from '@/components/AnimatedWatch';

const About = () => {
  const milestones = [
    { year: "1994", event: "Founded by master craftsman Henri watchShop" },
    { year: "2005", event: "First waterproof collection" },
    { year: "2015", event: "Introduction of automatic movement" },
    { year: "2020", event: "Launch of first complication series" },
    { year: "2023", event: "Sustainable luxury initiative" },
    { year: "2024", event: "30 years of horological excellence" }
  ];

  const values = [
    {
      title: "Craftsmanship",
      description: "Every timepiece is meticulously handcrafted by master artisans with generations of experience.",
      icon: "🎯"
    },
    {
      title: "Innovation",
      description: "We continuously push the boundaries of horological technology while respecting traditional methods.",
      icon: "💡"
    },
    {
      title: "Heritage",
      description: "30 years of Swiss watchmaking tradition passed down through generations of craftsmen.",
      icon: "🏛️"
    },
    {
      title: "Excellence",
      description: "Uncompromising quality standards ensure each watch meets the highest expectations.",
      icon: "⭐"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground">
                Our <span className="text-accent">Legacy</span>
              </h1>
              <p className="font-inter text-lg text-muted-foreground leading-relaxed">
                For over 30 years, watchShop has been synonymous with exceptional Swiss craftsmanship, 
                innovation, and timeless elegance. Our journey began in 1994 with a simple mission: 
                to create the finest timepieces in the world.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-playfair text-3xl font-bold text-accent">30+</div>
                  <div className="text-muted-foreground">Years of Heritage</div>
                </div>
                <div>
                  <div className="font-playfair text-3xl font-bold text-accent">15K+</div>
                  <div className="text-muted-foreground">Timepieces Crafted</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center animate-slide-in-right">
              <AnimatedWatch size={350} />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
              Our <span className="text-accent">Values</span>
            </h2>
            <p className="font-inter text-lg text-muted-foreground max-w-3xl mx-auto">
              The principles that guide every decision, every design, and every timepiece we create.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card 
                key={value.title}
                className="text-center p-6 border-0 shadow-luxury hover:shadow-luxury-glow luxury-hover animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="space-y-3">
                  <div className="text-3xl mb-3">{value.icon}</div>
                  <h3 className="font-playfair text-lg font-bold text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground">
              Our <span className="text-accent">Journey</span>
            </h2>
            <p className="font-inter text-lg text-muted-foreground max-w-3xl mx-auto">
              Key milestones that shaped our legacy of excellence.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-accent opacity-30"></div>
              {milestones.map((milestone, index) => (
                <div 
                  key={milestone.year}
                  className={`relative flex items-center mb-8 animate-fade-in ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-6' : 'text-left pl-6'}`}>
                    <Card className="p-4 shadow-luxury border-0">
                      <CardContent className="space-y-2">
                        <Badge className="bg-accent text-accent-foreground mb-2">
                          {milestone.year}
                        </Badge>
                        <p className="font-inter text-foreground">{milestone.event}</p>
                      </CardContent>
                    </Card>
                  </div>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rounded-full border-4 border-background shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <Footer />
    </div>
  );
};

export default About;