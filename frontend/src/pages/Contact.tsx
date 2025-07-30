import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useState } from 'react';
import { contactAPI } from '@/services/api';

const Contact = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await contactAPI.submit(form);
      setSuccess('Message sent successfully!');
      setForm({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Boutique",
      details: ["Softwarica College", "Kathmandu, Nepal"]
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+977 9800000000", "Sunday - Friday", "10:00 AM - 7:00 PM"]
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["watchshop@gmail.com", "watchshopservice@gmail.com"]
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Sun - Fri: 9:00 - 7:00", "Saturday: Closed"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-background/30" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center space-y-4 animate-fade-in-up">
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-foreground">
              Get In <span className="text-accent">Touch</span>
            </h1>
            <p className="font-inter text-lg text-muted-foreground max-w-3xl mx-auto">
              Whether you're seeking the perfect timepiece or need expert service, our team of specialists is here to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-foreground mb-3">
                  Send Us a Message
                </h2>
                <p className="text-muted-foreground">
                  Our experts will respond within 24 hours to assist with your inquiry.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-inter text-sm font-medium text-foreground mb-2 block">
                      First Name
                    </label>
                    <Input 
                      value={form.firstName} 
                      onChange={e => setForm({ ...form, firstName: e.target.value })} 
                      placeholder="Pratik" 
                      className="border-luxury-silver focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-inter text-sm font-medium text-foreground mb-2 block">
                      Last Name
                    </label>
                    <Input 
                      value={form.lastName} 
                      onChange={e => setForm({ ...form, lastName: e.target.value })} 
                      placeholder="Bhusal" 
                      className="border-luxury-silver focus:border-accent transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="font-inter text-sm font-medium text-foreground mb-2 block">
                    Email Address
                  </label>
                  <Input 
                    type="email" 
                    value={form.email} 
                    onChange={e => setForm({ ...form, email: e.target.value })} 
                    placeholder="pratik@gmail.com"
                    className="border-luxury-silver focus:border-accent transition-colors"
                  />
                </div>
                
                <div>
                  <label className="font-inter text-sm font-medium text-foreground mb-2 block">
                    Phone Number
                  </label>
                  <Input 
                    type="tel" 
                    value={form.phone} 
                    onChange={e => setForm({ ...form, phone: e.target.value })} 
                    placeholder="+977 9800000000"
                    className="border-luxury-silver focus:border-accent transition-colors"
                  />
                </div>
                
                <div>
                  <label className="font-inter text-sm font-medium text-foreground mb-2 block">
                    How can we help you?
                  </label>
                  <Textarea 
                    value={form.message} 
                    onChange={e => setForm({ ...form, message: e.target.value })} 
                    placeholder="Tell us about your inquiry..."
                    rows={6}
                    className="border-luxury-silver focus:border-accent transition-colors resize-none"
                  />
                </div>
                
                <Button 
                  type="submit"
                  size="lg"
                  className="w-full bg-luxury-gradient hover:shadow-luxury-glow transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
              {success && <div className="text-green-600 mb-4">{success}</div>}
              {error && <div className="text-red-600 mb-4">{error}</div>}
            </div>
            
            {/* Contact Information */}
            <div className="space-y-6 animate-slide-in-right">
              <div>
                <h2 className="font-playfair text-2xl font-bold text-foreground mb-3">
                  Visit Our Boutique
                </h2>
                <p className="text-muted-foreground">
                  Experience our timepieces in person at our flagship boutique in the heart of Kathmandu.
                </p>
              </div>
              
              <div className="grid gap-4">
                {contactInfo.map((info, index) => (
                  <Card 
                    key={info.title}
                    className="border-0 shadow-luxury hover:shadow-luxury-glow luxury-hover animate-fade-in"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 font-inter text-lg">
                        <div className="w-10 h-10 bg-luxury-gradient rounded-full flex items-center justify-center">
                          <info.icon className="w-5 h-5 text-accent-foreground" />
                        </div>
                        {info.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-muted-foreground">{detail}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Map Placeholder */}
              <Card className="border-0 shadow-luxury overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <MapPin className="w-12 h-12 text-accent mx-auto" />
                    <p className="font-inter text-muted-foreground">Interactive Map</p>
                    <p className="text-sm text-muted-foreground">Coming Soon</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-blue-100/50 to-blue-200/30">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-6 mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
              Frequently Asked <span className="text-accent">Questions</span>
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How long is the warranty on watchShop timepieces?",
                answer: "All watchShop timepieces come with a comprehensive 5-year international warranty covering manufacturing defects and movement issues."
              },
              {
                question: "Do you offer watch servicing and repairs?",
                answer: "Yes, our certified watchmakers provide complete servicing, repairs, and restoration for all watchShop timepieces at our Geneva facility."
              },
              {
                question: "Can I customize my timepiece?",
                answer: "We offer bespoke customization services including dial colors, case materials, and strap options. Contact us to discuss your unique requirements."
              },
              {
                question: "Do you offer financing options?",
                answer: "Yes, we provide flexible financing solutions for qualified customers. Our team can discuss various payment plans to suit your needs."
              }
            ].map((faq, index) => (
              <Card 
                key={index}
                className="border-0 shadow-luxury animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="font-inter text-lg text-foreground">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;