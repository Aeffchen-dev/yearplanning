import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Html, PerspectiveCamera } from '@react-three/drei';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Month cube component for 3D calendar
const MonthCube = ({ position, monthData, monthIndex }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + monthIndex) * 0.1;
    }
  });

  const monthColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD',
    '#00D2D3', '#FF9F43', '#EE5A24', '#0097E6'
  ];

  return (
    <group position={position}>
      <Box ref={meshRef} args={[2, 2, 2]}>
        <meshStandardMaterial color={monthColors[monthIndex]} />
      </Box>
      
      <Html position={[0, 1.5, 0]} center>
        <div className="bg-white/90 px-2 py-1 rounded shadow-lg text-sm font-bold text-black">
          {monthData.name}
        </div>
      </Html>
      
      <Html position={[0, -1.5, 0]} center>
        <div className="bg-white/80 px-2 py-1 rounded shadow text-xs text-black">
          {monthData.daysInMonth} days
        </div>
      </Html>
    </group>
  );
};

// Year display component
const YearDisplay = ({ year, position }: any) => {
  return (
    <group position={position}>
      <Text
        fontSize={3}
        color="#333"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {year}
      </Text>
    </group>
  );
};

// Floating controls component
const FloatingControls = ({ selectedYear, setSelectedYear, onExport }: any) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear + i);

  return (
    <Html position={[0, 8, 0]} center>
      <motion.div 
        className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">3D Year Planner</h1>
          
          <div className="flex items-center gap-4">
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={onExport} variant="default" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Export Plan
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 text-center max-w-md">
            Explore your year in 3D! Rotate and zoom to see each month. Click Export to download your planner.
          </p>
        </div>
      </motion.div>
    </Html>
  );
};

// Main 3D Scene component
const YearPlannerScene = ({ selectedYear }: { selectedYear: number }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateMonthData = () => {
    return months.map((monthName, monthIndex) => ({
      name: monthName,
      daysInMonth: getDaysInMonth(selectedYear, monthIndex),
      monthIndex
    }));
  };

  const monthsData = generateMonthData();

  // Arrange months in a circle
  const radius = 8;
  const positions = monthsData.map((_, index) => {
    const angle = (index / 12) * Math.PI * 2;
    return [
      Math.cos(angle) * radius,
      Math.sin(index * 0.5) * 2,
      Math.sin(angle) * radius
    ];
  });

  const handleExport = () => {
    // Create a simple export functionality
    const plannerData = {
      year: selectedYear,
      months: monthsData,
      exported: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(plannerData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `year-planner-${selectedYear}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Year display in center */}
      <YearDisplay year={selectedYear} position={[0, 0, 0]} />
      
      {/* Month cubes arranged in circle */}
      {monthsData.map((monthData, index) => (
        <MonthCube
          key={monthData.name}
          position={positions[index]}
          monthData={monthData}
          monthIndex={index}
        />
      ))}
      
      {/* Floating controls */}
      <FloatingControls
        selectedYear={selectedYear}
        setSelectedYear={() => {}} // Will be handled by parent
        onExport={handleExport}
      />
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={30}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
      
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 5, 15]} />
    </>
  );
};

const YearPlannerGenerator = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
      {/* Top controls overlay */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="bg-white/80 backdrop-blur-md border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Year Planner Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 21 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="bg-white/80 backdrop-blur-md border-white/20 max-w-sm">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">How to use:</h3>
            <ul className="text-sm space-y-1">
              <li>• Drag to rotate the view</li>
              <li>• Scroll to zoom in/out</li>
              <li>• Each cube represents a month</li>
              <li>• Auto-rotation shows all angles</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* 3D Canvas */}
      <Canvas>
        <Suspense fallback={
          <Html center>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Building your 3D year planner...</span>
              </div>
            </div>
          </Html>
        }>
          <YearPlannerScene selectedYear={selectedYear} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default YearPlannerGenerator;