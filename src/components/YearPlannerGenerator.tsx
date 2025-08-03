import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const YearPlannerGenerator = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Generate year options (current year to 20 years in the future)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 21 }, (_, i) => currentYear + i);
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Function to get number of days in a month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Function to get the first day of the month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Generate calendar data for the year
  const generateYearCalendar = () => {
    const yearData = months.map((monthName, monthIndex) => {
      const daysInMonth = getDaysInMonth(selectedYear, monthIndex);
      const firstDay = getFirstDayOfMonth(selectedYear, monthIndex);
      
      // Create array of 37 cells (max needed for any month layout)
      const days = Array(37).fill(null);
      
      // Fill in the days
      for (let day = 1; day <= daysInMonth; day++) {
        days[firstDay + day - 1] = day;
      }
      
      return {
        name: monthName,
        days: days
      };
    });
    
    return yearData;
  };
  
  const yearCalendar = generateYearCalendar();
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header Controls */}
      <div className="flex flex-col items-center gap-4 mb-8 print:hidden">
        <div className="flex items-center gap-4">
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-32">
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
          
          <Button onClick={handlePrint} variant="outline">
            Print plan
          </Button>
        </div>
      </div>
      
      {/* Info Boxes */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div className="bg-info text-info-foreground px-6 py-4 rounded text-center max-w-md">
          Print this on an A3 Sheet; Even if this looks weird on your Laptop, A3 print will be accurate :)
        </div>
        
        <div className="bg-info text-info-foreground px-6 py-4 rounded text-center max-w-md">
          If you face any issues; You can file an issue here{' '}
          <a 
            href="https://github.com/year-planner-generator" 
            className="underline hover:text-opacity-80"
            target="_blank"
            rel="noopener noreferrer"
          >
            Year-planner-generator github
          </a>
        </div>
      </div>
      
      {/* Year Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px] border-2 border-planner-grid">
          {/* Days of week header - rotated text */}
          <div className="grid grid-cols-[60px_repeat(37,1fr)] border-b border-planner-grid">
            <div className="border-r border-planner-grid"></div>
            {Array.from({ length: 37 }, (_, i) => (
              <div key={i} className="h-16 border-r border-planner-grid flex items-center justify-center">
                {i < 7 && (
                  <div className="transform -rotate-90 text-xs font-medium whitespace-nowrap">
                    {daysOfWeek[i]}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Month rows */}
          {yearCalendar.map((month, monthIndex) => (
            <div key={month.name} className="grid grid-cols-[60px_repeat(37,1fr)] border-b border-planner-grid last:border-b-0">
              {/* Month name */}
              <div className="border-r border-planner-grid flex items-center justify-center p-2 bg-card">
                <div className="transform -rotate-90 font-bold text-sm">
                  {month.name}
                </div>
              </div>
              
              {/* Days */}
              {month.days.map((day, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className="h-12 border-r border-planner-grid bg-planner-cell flex items-center justify-center text-xs font-medium last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default YearPlannerGenerator;