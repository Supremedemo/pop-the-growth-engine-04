
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Gift, Sparkles } from "lucide-react";

interface GamifiedTemplatePreviewProps {
  template: any;
  config: any;
  onClose?: () => void;
  onSubmit?: (data: any) => void;
}

export const GamifiedTemplatePreview = ({ 
  template, 
  config, 
  onClose, 
  onSubmit 
}: GamifiedTemplatePreviewProps) => {
  const [gameState, setGameState] = useState<any>({});
  const [userEmail, setUserEmail] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const renderSpinWheel = () => {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);

    const spin = () => {
      if (spinning) return;
      
      setSpinning(true);
      const randomRotation = Math.floor(Math.random() * 360) + 1080; // At least 3 full spins
      setRotation(prev => prev + randomRotation);
      
      setTimeout(() => {
        const prizeIndex = Math.floor(Math.random() * config.prizes.length);
        setResult(config.prizes[prizeIndex]);
        setSpinning(false);
        setShowEmailForm(true);
      }, 3000);
    };

    return (
      <div className="text-center space-y-6">
        <div className="relative w-64 h-64 mx-auto">
          {/* Wheel */}
          <div 
            className="w-full h-full rounded-full border-8 border-gray-300 relative overflow-hidden transition-transform duration-3000 ease-out"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(${config.colors.map((color: string, i: number) => 
                `${color} ${(i * 360) / config.colors.length}deg ${((i + 1) * 360) / config.colors.length}deg`
              ).join(', ')})`
            }}
          >
            {/* Prize segments */}
            {config.prizes.map((prize: string, index: number) => (
              <div
                key={index}
                className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm"
                style={{
                  transform: `rotate(${(index * 360) / config.prizes.length}deg)`,
                  transformOrigin: '50% 50%'
                }}
              >
                <span 
                  className="transform"
                  style={{ 
                    transform: `translateY(-80px) rotate(${(360 / config.prizes.length) / 2}deg)` 
                  }}
                >
                  {prize}
                </span>
              </div>
            ))}
          </div>
          
          {/* Center button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={spin}
              disabled={spinning}
              className="w-16 h-16 rounded-full bg-white text-black border-4 border-gray-300 font-bold shadow-lg hover:scale-105 transition-transform"
            >
              {spinning ? '...' : config.centerText || 'SPIN'}
            </Button>
          </div>
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
          </div>
        </div>

        {result && (
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold text-green-600 flex items-center justify-center">
              <Gift className="w-6 h-6 mr-2" />
              Congratulations!
            </div>
            <Badge className="text-lg px-4 py-2">{result}</Badge>
          </div>
        )}

        {!result && (
          <Button 
            onClick={spin} 
            disabled={spinning}
            className="px-8 py-3 text-lg"
            style={{ backgroundColor: config.primaryColor || '#4ECDC4' }}
          >
            {config.buttonText || 'Spin to Win!'}
          </Button>
        )}
      </div>
    );
  };

  const renderScratchCard = () => {
    const [scratched, setScratched] = useState(false);
    const [isScratching, setIsScratching] = useState(false);

    const handleScratch = () => {
      if (scratched) return;
      setIsScratching(true);
      
      setTimeout(() => {
        setScratched(true);
        setIsScratching(false);
        setShowEmailForm(true);
      }, 1500);
    };

    return (
      <div className="text-center space-y-6">
        <div className="relative w-64 h-40 mx-auto">
          <div 
            className={`w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-xl cursor-pointer transition-all duration-1000 ${
              scratched ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ backgroundColor: config.cardColor || '#silver' }}
            onClick={handleScratch}
          >
            {isScratching ? (
              <div className="animate-pulse">Scratching...</div>
            ) : (
              <div>Click to Scratch!</div>
            )}
          </div>
          
          {scratched && (
            <div 
              className="absolute inset-0 rounded-lg flex items-center justify-center text-2xl font-bold animate-bounce"
              style={{ 
                backgroundColor: config.backgroundColor || '#f8f9fa',
                color: config.textColor || '#333333'
              }}
            >
              <div className="text-center">
                <Gift className="w-8 h-8 mx-auto mb-2 text-green-500" />
                {config.revealText || 'You Won!'}
              </div>
            </div>
          )}
        </div>

        {!scratched && (
          <Button 
            onClick={handleScratch}
            className="px-8 py-3 text-lg"
          >
            {config.buttonText || 'Scratch to Win!'}
          </Button>
        )}
      </div>
    );
  };

  const renderEmailForm = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Claim Your Prize!</h3>
        <p className="text-gray-600">Enter your email to receive your reward</p>
      </div>
      
      <div className="space-y-3">
        <Input
          type="email"
          placeholder="Enter your email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
        />
        <Button 
          className="w-full"
          onClick={() => {
            if (userEmail) {
              onSubmit?.({ email: userEmail, prize: gameState.result });
              onClose?.();
            }
          }}
        >
          Claim Prize
        </Button>
      </div>
    </div>
  );

  const renderTemplate = () => {
    if (showEmailForm) {
      return renderEmailForm();
    }

    switch (template.id) {
      case 'spin-wheel':
        return renderSpinWheel();
      case 'scratch-card':
        return renderScratchCard();
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold mb-4">{template.name}</h3>
            <p className="text-gray-600 mb-6">{template.description}</p>
            <Button onClick={() => setShowEmailForm(true)}>
              {config.buttonText || 'Get Started'}
            </Button>
          </div>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: config.backgroundColor || '#ffffff' }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-10"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
        
        <CardContent className="p-6" style={{ color: config.textColor || '#333333' }}>
          {renderTemplate()}
        </CardContent>
        
        {config.showConfetti && showEmailForm && (
          <div className="absolute inset-0 pointer-events-none">
            <Sparkles className="absolute top-4 left-4 w-6 h-6 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute top-8 right-8 w-4 h-4 text-blue-400 animate-pulse" />
            <Sparkles className="absolute bottom-12 left-8 w-5 h-5 text-green-400 animate-pulse" />
            <Sparkles className="absolute bottom-8 right-4 w-6 h-6 text-purple-400 animate-pulse" />
          </div>
        )}
      </Card>
    </div>
  );
};
