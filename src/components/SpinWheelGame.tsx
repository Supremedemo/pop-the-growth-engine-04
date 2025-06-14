
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, RotateCcw, Settings, Play } from 'lucide-react';

interface WheelSegment {
  id: string;
  label: string;
  color: string;
  probability: number;
}

interface SpinWheelGameProps {
  isEditorMode?: boolean;
  onCustomize?: (config: SpinWheelConfig) => void;
}

interface SpinWheelConfig {
  title: string;
  subtitle: string;
  segments: WheelSegment[];
  wheelSize: number;
  spinDuration: number;
  showConfetti: boolean;
  buttonText: string;
  buttonColor: string;
}

export const SpinWheelGame = ({ isEditorMode = false, onCustomize }: SpinWheelGameProps) => {
  const [config, setConfig] = useState<SpinWheelConfig>({
    title: "🎡 SPIN TO WIN! 🎡",
    subtitle: "Click the wheel to spin and win amazing prizes!",
    segments: [
      { id: '1', label: '10% OFF', color: '#ff6b6b', probability: 25 },
      { id: '2', label: '20% OFF', color: '#4ecdc4', probability: 20 },
      { id: '3', label: '5% OFF', color: '#45b7d1', probability: 30 },
      { id: '4', label: 'FREE SHIPPING', color: '#96ceb4', probability: 15 },
      { id: '5', label: 'TRY AGAIN', color: '#ffeaa7', probability: 10 }
    ],
    wheelSize: 300,
    spinDuration: 3000,
    showConfetti: true,
    buttonText: "SPIN NOW!",
    buttonColor: "#ff6b6b"
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spinWheel = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    // Calculate winning segment based on probability
    const random = Math.random() * 100;
    let cumulative = 0;
    let winningSegment = config.segments[0];

    for (const segment of config.segments) {
      cumulative += segment.probability;
      if (random <= cumulative) {
        winningSegment = segment;
        break;
      }
    }

    // Calculate rotation
    const segmentAngle = 360 / config.segments.length;
    const winningIndex = config.segments.findIndex(s => s.id === winningSegment.id);
    const targetAngle = (winningIndex * segmentAngle) + (segmentAngle / 2);
    const finalRotation = rotation + 1440 + (360 - targetAngle); // 4 full spins + target

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(winningSegment.label);
    }, config.spinDuration);
  }, [isSpinning, rotation, config]);

  const updateConfig = (updates: Partial<SpinWheelConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onCustomize?.(newConfig);
  };

  const addSegment = () => {
    const newSegment: WheelSegment = {
      id: Date.now().toString(),
      label: 'New Prize',
      color: '#' + Math.floor(Math.random()*16777215).toString(16),
      probability: 10
    };
    updateConfig({
      segments: [...config.segments, newSegment]
    });
  };

  const removeSegment = (id: string) => {
    if (config.segments.length <= 2) return; // Minimum 2 segments
    updateConfig({
      segments: config.segments.filter(s => s.id !== id)
    });
  };

  const updateSegment = (id: string, updates: Partial<WheelSegment>) => {
    updateConfig({
      segments: config.segments.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const resetWheel = () => {
    setRotation(0);
    setWinner(null);
    setIsSpinning(false);
  };

  const renderWheel = () => {
    const segmentAngle = 360 / config.segments.length;
    
    return (
      <div className="relative flex items-center justify-center">
        <div
          ref={wheelRef}
          className="relative rounded-full border-4 border-yellow-400 shadow-2xl transition-transform ease-out"
          style={{
            width: config.wheelSize,
            height: config.wheelSize,
            transform: `rotate(${rotation}deg)`,
            transitionDuration: isSpinning ? `${config.spinDuration}ms` : '0ms'
          }}
        >
          <svg
            width={config.wheelSize}
            height={config.wheelSize}
            viewBox={`0 0 ${config.wheelSize} ${config.wheelSize}`}
            className="absolute inset-0"
          >
            {config.segments.map((segment, index) => {
              const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
              const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
              const radius = config.wheelSize / 2 - 10;
              const centerX = config.wheelSize / 2;
              const centerY = config.wheelSize / 2;

              const x1 = centerX + radius * Math.cos(startAngle);
              const y1 = centerY + radius * Math.sin(startAngle);
              const x2 = centerX + radius * Math.cos(endAngle);
              const y2 = centerY + radius * Math.sin(endAngle);

              const largeArcFlag = segmentAngle > 180 ? 1 : 0;

              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');

              const textAngle = (startAngle + endAngle) / 2;
              const textRadius = radius * 0.7;
              const textX = centerX + textRadius * Math.cos(textAngle);
              const textY = centerY + textRadius * Math.sin(textAngle);

              return (
                <g key={segment.id}>
                  <path
                    d={pathData}
                    fill={segment.color}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${(textAngle * 180) / Math.PI}, ${textX}, ${textY})`}
                  >
                    {segment.label}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Center circle */}
          <div 
            className="absolute bg-white rounded-full border-4 border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            style={{
              width: config.wheelSize * 0.15,
              height: config.wheelSize * 0.15,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            onClick={!isEditorMode ? spinWheel : undefined}
          >
            <Play className="w-6 h-6 text-gray-600" />
          </div>
        </div>

        {/* Pointer */}
        <div 
          className="absolute bg-red-500 transform -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: '30px solid #ef4444',
            top: '10px',
            left: '50%'
          }}
        />
      </div>
    );
  };

  if (isEditorMode) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto">
        {/* Game Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Game Preview
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={resetWheel}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <h2 className="text-2xl font-bold">{config.title}</h2>
            <p className="text-gray-600">{config.subtitle}</p>
            
            {renderWheel()}
            
            <Button
              onClick={spinWheel}
              disabled={isSpinning}
              style={{ backgroundColor: config.buttonColor }}
              className="text-white font-bold px-8 py-3 text-lg"
            >
              {isSpinning ? 'SPINNING...' : config.buttonText}
            </Button>

            {winner && (
              <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                <h3 className="text-xl font-bold text-green-800">🎉 Congratulations! 🎉</h3>
                <p className="text-green-700">You won: <strong>{winner}</strong></p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customization Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Customize Game
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* General Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold">General Settings</h3>
              
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={(e) => updateConfig({ title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={config.subtitle}
                  onChange={(e) => updateConfig({ subtitle: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={config.buttonText}
                  onChange={(e) => updateConfig({ buttonText: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="buttonColor">Button Color</Label>
                <Input
                  id="buttonColor"
                  type="color"
                  value={config.buttonColor}
                  onChange={(e) => updateConfig({ buttonColor: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="wheelSize">Wheel Size: {config.wheelSize}px</Label>
                <Input
                  id="wheelSize"
                  type="range"
                  min="200"
                  max="400"
                  value={config.wheelSize}
                  onChange={(e) => updateConfig({ wheelSize: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <Separator />

            {/* Segments */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Prize Segments</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSegment}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Segment
                </Button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {config.segments.map((segment) => (
                  <div key={segment.id} className="flex items-center gap-2 p-3 border rounded-lg">
                    <input
                      type="color"
                      value={segment.color}
                      onChange={(e) => updateSegment(segment.id, { color: e.target.value })}
                      className="w-8 h-8 rounded border"
                    />
                    <Input
                      value={segment.label}
                      onChange={(e) => updateSegment(segment.id, { label: e.target.value })}
                      placeholder="Prize text"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={segment.probability}
                      onChange={(e) => updateSegment(segment.id, { probability: parseInt(e.target.value) || 0 })}
                      className="w-16"
                      min="1"
                      max="100"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSegment(segment.id)}
                      disabled={config.segments.length <= 2}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-gray-500">
                Total probability: {config.segments.reduce((sum, s) => sum + s.probability, 0)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Live game mode
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6">
      <div className="bg-white rounded-lg shadow-2xl p-8 text-center max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
        <p className="text-gray-600 mb-6">{config.subtitle}</p>
        
        {renderWheel()}
        
        <Button
          onClick={spinWheel}
          disabled={isSpinning}
          style={{ backgroundColor: config.buttonColor }}
          className="mt-6 text-white font-bold px-8 py-3 text-lg"
        >
          {isSpinning ? 'SPINNING...' : config.buttonText}
        </Button>

        {winner && (
          <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
            <h3 className="text-xl font-bold text-green-800">🎉 Congratulations! 🎉</h3>
            <p className="text-green-700">You won: <strong>{winner}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};
