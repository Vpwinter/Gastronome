'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SubstitutionWizard from '@/components/SubstitutionWizard';
import MeasurementConverter from '@/components/MeasurementConverter';
import { Calculator, ArrowRightLeft, Wrench, X } from 'lucide-react';

type ToolType = 'substitution' | 'converter' | null;

export function FloatingToolsMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolType>(null);

  const openTool = (tool: ToolType) => {
    setActiveTool(tool);
    setIsMenuOpen(false);
  };

  const closeTool = () => {
    setActiveTool(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Menu Options - appear above the main button when menu is open */}
          {isMenuOpen && (
            <div className="absolute bottom-16 right-0 flex flex-col space-y-3">
              {/* Substitution Wizard Button */}
              <Button
                onClick={() => openTool('substitution')}
                className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700"
                title="Ingredient Substitutions"
              >
                <ArrowRightLeft className="h-6 w-6" />
              </Button>
              
              {/* Measurement Converter Button */}
              <Button
                onClick={() => openTool('converter')}
                className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-green-600 hover:bg-green-700"
                title="Measurement Converter"
              >
                <Calculator className="h-6 w-6" />
              </Button>
            </div>
          )}

          {/* Main Tools Button */}
          <Button
            onClick={toggleMenu}
            className={`w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
              isMenuOpen 
                ? 'bg-red-600 hover:bg-red-700 rotate-45' 
                : 'bg-primary hover:bg-primary/90'
            }`}
            title="Cooking Tools"
          >
            {isMenuOpen ? (
              <X className="h-8 w-8" />
            ) : (
              <Wrench className="h-8 w-8" />
            )}
          </Button>
        </div>

        {/* Backdrop to close menu when clicking outside */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 -z-10" 
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>

      {/* Substitution Wizard Dialog */}
      <Dialog open={activeTool === 'substitution'} onOpenChange={closeTool}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              Ingredient Substitution Wizard
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <SubstitutionWizard />
          </div>
        </DialogContent>
      </Dialog>

      {/* Measurement Converter Dialog */}
      <Dialog open={activeTool === 'converter'} onOpenChange={closeTool}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Measurement Converter
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <MeasurementConverter />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 