import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX - window.innerWidth / 2) / 50; // Increased parallax effect
    const y = (e.clientY - window.innerHeight / 2) / 50; // Increased parallax effect
    setParallax({ x, y });
  };

  const imageUrl = '/beauty.png'; // beauty.png image URL, corrected path

  return (
    <section className="relative h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Text Content */}
        <div className="text-white">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 100 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 max-w-4xl bg-gradient-to-r from-primary via-purple-400 to-pink-400 text-transparent bg-clip-text"
          >
            Beauty and Lifestyle Marketplace
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10"
          >
            Discover and book amazing services from the best local providers. Your one-stop marketplace for quality, convenience, and style.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for services..."
                className="pl-10 h-12 text-base text-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              size="lg"
              className="w-full sm:w-auto group"
              onClick={() => {
                if (searchQuery) {
                  navigate(`/services?search=${searchQuery}`);
                }
              }}
            >
              Search
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        {/* Right Side: Parallax Image */}
        <motion.div
          className="w-full h-full md:h-[400px] shadow-2xl rounded-lg overflow-hidden relative" // Added relative for absolute positioning of img
          onMouseMove={handleMouseMove}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          style={{
            transform: `scale(${isHovered ? 1.1 : 1}) translate(${parallax.x}px, ${parallax.y}px)`,
            transition: 'transform 0.2s ease-out',
          }}
        >
          <img
            src={imageUrl}
            alt="Beauty and Lifestyle Services"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager" // Eager loading for above-the-fold hero image
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
