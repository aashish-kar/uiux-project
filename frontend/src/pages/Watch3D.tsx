import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  RotateCcw, 
  RotateCw, 
  Maximize, 
  Minimize, 
  Download, 
  Share2,
  BookOpen,
  Palette,
  Settings,
  Watch
} from 'lucide-react';

// Simple 3D Watch Component using only basic Three.js
function WatchModel({ 
  dialColor, 
  strapColor, 
  engraving, 
  rotation, 
  setRotation 
}: {
  dialColor: string;
  strapColor: string;
  engraving: string;
  rotation: number;
  setRotation: (rotation: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Watch Case (main body) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.3, 32]} />
        <meshStandardMaterial color="#silver" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Watch Dial */}
      <mesh position={[0, 0, 0.16]}>
        <cylinderGeometry args={[0.75, 0.75, 0.05, 32]} />
        <meshStandardMaterial color={dialColor} metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Watch Crystal (glass) */}
      <mesh position={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.75, 0.75, 0.02, 32]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>

      {/* Watch Hands */}
      <mesh position={[0, 0, 0.22]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.02, 0.6, 0.01]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, 0, 0.22]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.02, 0.4, 0.01]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Center Dot */}
      <mesh position={[0, 0, 0.23]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Hour Markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * Math.PI) / 6;
        const x = Math.cos(angle) * 0.6;
        const y = Math.sin(angle) * 0.6;
        return (
          <mesh key={i} position={[x, y, 0.21]}>
            <boxGeometry args={[0.02, 0.02, 0.01]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        );
      })}

      {/* Strap - Left Side */}
      <mesh position={[-1.2, 0, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.1]} />
        <meshStandardMaterial color={strapColor} />
      </mesh>

      {/* Strap - Right Side */}
      <mesh position={[1.2, 0, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.1]} />
        <meshStandardMaterial color={strapColor} />
      </mesh>

      {/* Strap Buckle */}
      <mesh position={[0, 0, -0.6]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#gold" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Strap Holes */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[-0.8 + i * 0.2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      ))}

      {/* Simple Engraving using basic shapes */}
      {engraving && (
        <group position={[0, -0.4, 0.25]}>
          {engraving.split('').map((char, index) => (
            <mesh key={index} position={[(index - engraving.length / 2) * 0.06, 0, 0]}>
              <boxGeometry args={[0.04, 0.06, 0.01]} />
              <meshStandardMaterial color="#gold" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

// Fallback component for when 3D fails
function WatchFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
      <div className="text-center">
        <Watch className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">3D Preview Unavailable</p>
        <p className="text-sm text-gray-500">Please check your browser settings</p>
      </div>
    </div>
  );
}

export default function Watch3D() {
  const [dialColor, setDialColor] = useState('#1a1a1a');
  const [strapColor, setStrapColor] = useState('#8B4513');
  const [engraving, setEngraving] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('customize');
  const [is3DSupported, setIs3DSupported] = useState(true);

  const handleRotation = (direction: 'left' | 'right') => {
    const increment = direction === 'left' ? -0.1 : 0.1;
    setRotation(rotation + increment);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    alert('Watch configuration saved!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Custom Watch',
        text: 'Check out my custom watch design!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleBookModification = () => {
    alert('Modification request sent! We\'ll contact you soon.');
  };

  const colorOptions = [
    { name: 'Classic Black', value: '#1a1a1a' },
    { name: 'Royal Blue', value: '#1e3a8a' },
    { name: 'Emerald Green', value: '#065f46' },
    { name: 'Ruby Red', value: '#991b1b' },
    { name: 'Gold', value: '#d97706' },
    { name: 'Silver', value: '#6b7280' },
    { name: 'Rose Gold', value: '#be185d' },
    { name: 'Platinum', value: '#e5e7eb' }
  ];

  const strapOptions = [
    { name: 'Brown Leather', value: '#8B4513' },
    { name: 'Black Leather', value: '#1a1a1a' },
    { name: 'Blue Leather', value: '#1e3a8a' },
    { name: 'Red Leather', value: '#991b1b' },
    { name: 'Gold Bracelet', value: '#d97706' },
    { name: 'Silver Bracelet', value: '#6b7280' },
    { name: 'Rose Gold Bracelet', value: '#be185d' },
    { name: 'Platinum Bracelet', value: '#e5e7eb' }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 z-50' : ''
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">3D Watch Customization</h1>
          <p className="text-gray-600">Design your perfect watch with our interactive 3D preview</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 3D Preview Section */}
          <Card className="h-[600px]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">3D Preview</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRotation('left')}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRotation('right')}
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-full">
              {is3DSupported ? (
                <div className="w-full h-full relative">
                  <Canvas
                    camera={{ position: [0, 0, 4], fov: 50 }}
                    style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
                  >
                    <Suspense fallback={<WatchFallback />}>
                      <ambientLight intensity={0.6} />
                      <directionalLight position={[10, 10, 5]} intensity={1} />
                      <pointLight position={[-10, -10, -5]} intensity={0.5} />
                      
                      <WatchModel
                        dialColor={dialColor}
                        strapColor={strapColor}
                        engraving={engraving}
                        rotation={rotation}
                        setRotation={setRotation}
                      />
                    </Suspense>
                  </Canvas>
                </div>
              ) : (
                <WatchFallback />
              )}
            </CardContent>
          </Card>

          {/* Customization Panel */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="customize" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Customize
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="actions" className="flex items-center gap-2">
                  <Watch className="w-4 h-4" />
                  Actions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customize" className="space-y-6">
                {/* Dial Color */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dial Color</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setDialColor(color.value)}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            dialColor === color.value 
                              ? 'border-blue-500 scale-110' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Strap Color */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Strap Color</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                      {strapOptions.map((strap) => (
                        <button
                          key={strap.value}
                          onClick={() => setStrapColor(strap.value)}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            strapColor === strap.value 
                              ? 'border-blue-500 scale-110' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: strap.value }}
                          title={strap.name}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Engraving */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Engraving</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="Enter your engraving text..."
                      value={engraving}
                      onChange={(e) => setEngraving(e.target.value)}
                      maxLength={20}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {engraving.length}/20 characters
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Watch Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Case Size</Label>
                      <div className="text-sm text-gray-600">40mm diameter</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Movement</Label>
                      <div className="text-sm text-gray-600">Automatic chronograph</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Water Resistance</Label>
                      <div className="text-sm text-gray-600">100 meters</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Material</Label>
                      <div className="text-sm text-gray-600">Stainless steel</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <div className="text-2xl font-bold text-green-600">Rs 2,500,000</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="actions" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <Download className="w-4 h-4" />
                    Download Config
                  </Button>
                  <Button 
                    onClick={handleShare}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Design
                  </Button>
                </div>
                
                <Button 
                  onClick={handleBookModification}
                  className="w-full flex items-center gap-2"
                  size="lg"
                >
                  <BookOpen className="w-4 h-4" />
                  Book Modification
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 