import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MySessions from '@/pages/home/MySessions';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
          Collect <span className="text-cyan-400">Contacts</span>
          <br />
          <span className="gradient-text">Effortlessly</span>
        </h1>
        <p className="max-w-2xl mx-auto mt-6 text-lg text-gray-400">
          The simplest way to gather contact information from your community, event, or WhatsApp group and export it as a VCF file.
        </p>
        <Button
          onClick={() => navigate('/create')}
          className="mt-8 gradient-bg text-white text-lg font-semibold h-14 px-8 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20"
        >
          <PlusCircle className="w-6 h-6 mr-3" />
          Create a New Session
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-20"
      >
        <MySessions />
      </motion.div>
    </div>
  );
};

export default HomePage;