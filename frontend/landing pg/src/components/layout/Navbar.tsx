import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { navItems } from '../../data/mockData';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-[#e2e8f0] transition-shadow duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-12">
          <a href="#" className="flex items-center gap-2 group">
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-[#0f172a] group-hover:text-[#316bf3] transition-colors">
              MatterMind
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-[#45464d] hover:text-[#0f172a] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right CTA Buttons */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="#signin"
            className="text-sm font-semibold text-[#0f172a] px-4 py-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            Sign In
          </a>
          <Button variant="primary" size="md">
            Start Free Demo
          </Button>
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="sm:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#0f172a] hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-[#e2e8f0] px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-[#45464d] hover:text-[#0f172a] py-2 border-b border-slate-100"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <a
              href="#signin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-sm font-semibold py-2.5 text-[#0f172a] border border-[#e2e8f0] rounded-full"
            >
              Sign In
            </a>
            <Button
              variant="primary"
              size="md"
              className="w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start Free Demo
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
