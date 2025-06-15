
-- Create table for gamified templates
CREATE TABLE public.gamified_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('spin-wheel', 'scratch-card', 'slot-machine', 'memory-game', 'quiz', 'survey')),
  html_template TEXT NOT NULL,
  css_template TEXT NOT NULL,
  js_template TEXT NOT NULL,
  default_config JSONB NOT NULL DEFAULT '{}',
  preview_image TEXT,
  level_required INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.gamified_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (templates should be available to all users)
CREATE POLICY "Anyone can view active gamified templates" 
  ON public.gamified_templates 
  FOR SELECT 
  USING (is_active = true);

-- Insert some real gamified templates
INSERT INTO public.gamified_templates (name, description, category, html_template, css_template, js_template, default_config, level_required) VALUES 
(
  'Spin the Wheel',
  'Interactive spinning wheel with customizable prizes and colors',
  'spin-wheel',
  '<div class="spin-wheel-container">
    <div class="wheel-wrapper">
      <canvas id="wheelCanvas" width="300" height="300"></canvas>
      <div class="wheel-pointer"></div>
      <button id="spinBtn" class="spin-button">{{buttonText}}</button>
    </div>
    <div class="prize-display" id="prizeDisplay" style="display: none;">
      <h3>Congratulations!</h3>
      <p id="prizeText"></p>
      <div class="email-form">
        <input type="email" id="emailInput" placeholder="Enter your email to claim">
        <button id="claimBtn">Claim Prize</button>
      </div>
    </div>
  </div>',
  '.spin-wheel-container { text-align: center; padding: 20px; background: {{backgroundColor}}; color: {{textColor}}; border-radius: 10px; }
   .wheel-wrapper { position: relative; display: inline-block; }
   #wheelCanvas { border: 4px solid #333; border-radius: 50%; }
   .wheel-pointer { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 20px solid #333; z-index: 10; }
   .spin-button { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 10px 20px; background: {{primaryColor}}; color: white; border: none; border-radius: 50%; cursor: pointer; font-weight: bold; }
   .prize-display { margin-top: 20px; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
   .email-form { margin-top: 15px; }
   .email-form input { padding: 10px; margin-right: 10px; border: 1px solid #ddd; border-radius: 5px; }
   .email-form button { padding: 10px 20px; background: {{primaryColor}}; color: white; border: none; border-radius: 5px; cursor: pointer; }',
  'class SpinWheel {
    constructor(config) {
      this.config = config;
      this.canvas = document.getElementById("wheelCanvas");
      this.ctx = this.canvas.getContext("2d");
      this.prizes = config.prizes || ["Prize 1", "Prize 2", "Prize 3"];
      this.colors = config.colors || ["#FF6B6B", "#4ECDC4", "#45B7D1"];
      this.currentRotation = 0;
      this.isSpinning = false;
      this.init();
    }
    
    init() {
      this.drawWheel();
      document.getElementById("spinBtn").addEventListener("click", () => this.spin());
      document.getElementById("claimBtn").addEventListener("click", () => this.claimPrize());
    }
    
    drawWheel() {
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      const radius = 140;
      const sliceAngle = (2 * Math.PI) / this.prizes.length;
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      for (let i = 0; i < this.prizes.length; i++) {
        const startAngle = i * sliceAngle + this.currentRotation;
        const endAngle = startAngle + sliceAngle;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        this.ctx.lineTo(centerX, centerY);
        this.ctx.fillStyle = this.colors[i % this.colors.length];
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(startAngle + sliceAngle / 2);
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "white";
        this.ctx.font = "14px Arial";
        this.ctx.fillText(this.prizes[i], radius - 30, 5);
        this.ctx.restore();
      }
    }
    
    spin() {
      if (this.isSpinning) return;
      this.isSpinning = true;
      
      const spinDuration = 3000;
      const spinRotation = Math.random() * 2 * Math.PI + 4 * Math.PI;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        this.currentRotation = spinRotation * easeOut;
        this.drawWheel();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.showPrize();
        }
      };
      
      animate();
    }
    
    showPrize() {
      const sliceAngle = (2 * Math.PI) / this.prizes.length;
      const normalizedRotation = (this.currentRotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const prizeIndex = Math.floor(((2 * Math.PI - normalizedRotation) % (2 * Math.PI)) / sliceAngle);
      const prize = this.prizes[prizeIndex];
      
      document.getElementById("prizeText").textContent = prize;
      document.getElementById("prizeDisplay").style.display = "block";
      this.isSpinning = false;
    }
    
    claimPrize() {
      const email = document.getElementById("emailInput").value;
      if (email && this.config.onSubmit) {
        this.config.onSubmit({ email, prize: document.getElementById("prizeText").textContent });
      }
    }
  }
  
  new SpinWheel(window.templateConfig);',
  '{"prizes": ["10% Off", "20% Off", "Free Shipping", "Try Again", "30% Off", "Free Gift"], "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"], "backgroundColor": "#ffffff", "textColor": "#333333", "buttonText": "Spin to Win!", "primaryColor": "#4ECDC4"}',
  1
),
(
  'Scratch Card',
  'Interactive scratch-off card with hidden rewards',
  'scratch-card',
  '<div class="scratch-card-container">
    <div class="card-wrapper">
      <canvas id="scratchCanvas" width="300" height="200"></canvas>
      <div class="scratch-instruction">Scratch to reveal your prize!</div>
    </div>
    <div class="prize-display" id="prizeDisplay" style="display: none;">
      <h3>{{revealTitle}}</h3>
      <p id="prizeText">{{revealText}}</p>
      <div class="email-form">
        <input type="email" id="emailInput" placeholder="Enter your email to claim">
        <button id="claimBtn">{{buttonText}}</button>
      </div>
    </div>
  </div>',
  '.scratch-card-container { text-align: center; padding: 20px; background: {{backgroundColor}}; color: {{textColor}}; border-radius: 10px; }
   .card-wrapper { position: relative; display: inline-block; margin: 20px; }
   #scratchCanvas { border: 2px solid #ddd; border-radius: 10px; cursor: crosshair; background: {{cardColor}}; }
   .scratch-instruction { margin-top: 10px; font-size: 14px; color: #666; }
   .prize-display { margin-top: 20px; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
   .email-form { margin-top: 15px; }
   .email-form input { padding: 10px; margin-right: 10px; border: 1px solid #ddd; border-radius: 5px; }
   .email-form button { padding: 10px 20px; background: {{primaryColor}}; color: white; border: none; border-radius: 5px; cursor: pointer; }',
  'class ScratchCard {
    constructor(config) {
      this.config = config;
      this.canvas = document.getElementById("scratchCanvas");
      this.ctx = this.canvas.getContext("2d");
      this.isScratching = false;
      this.scratchedArea = 0;
      this.init();
    }
    
    init() {
      this.setupCanvas();
      this.addEventListeners();
      document.getElementById("claimBtn").addEventListener("click", () => this.claimPrize());
    }
    
    setupCanvas() {
      this.ctx.fillStyle = "#c0c0c0";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = this.config.textColor || "#333";
      this.ctx.font = "16px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Scratch here!", this.canvas.width/2, this.canvas.height/2);
      
      this.ctx.globalCompositeOperation = "destination-out";
    }
    
    addEventListeners() {
      this.canvas.addEventListener("mousedown", (e) => this.startScratch(e));
      this.canvas.addEventListener("mousemove", (e) => this.scratch(e));
      this.canvas.addEventListener("mouseup", () => this.stopScratch());
      
      this.canvas.addEventListener("touchstart", (e) => this.startScratch(e.touches[0]));
      this.canvas.addEventListener("touchmove", (e) => this.scratch(e.touches[0]));
      this.canvas.addEventListener("touchend", () => this.stopScratch());
    }
    
    startScratch(e) {
      this.isScratching = true;
      this.scratch(e);
    }
    
    scratch(e) {
      if (!this.isScratching) return;
      
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, 20, 0, 2 * Math.PI);
      this.ctx.fill();
      
      this.scratchedArea += 400;
      
      if (this.scratchedArea > this.canvas.width * this.canvas.height * 0.3) {
        this.revealPrize();
      }
    }
    
    stopScratch() {
      this.isScratching = false;
    }
    
    revealPrize() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      document.getElementById("prizeDisplay").style.display = "block";
    }
    
    claimPrize() {
      const email = document.getElementById("emailInput").value;
      if (email && this.config.onSubmit) {
        this.config.onSubmit({ email, prize: this.config.revealText });
      }
    }
  }
  
  new ScratchCard(window.templateConfig);',
  '{"revealText": "You Won 20% Off!", "revealTitle": "Congratulations!", "backgroundColor": "#f8f9fa", "cardColor": "#silver", "textColor": "#333333", "buttonText": "Claim Your Prize", "primaryColor": "#4ECDC4"}',
  2
);
