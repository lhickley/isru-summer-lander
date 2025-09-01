class MarsLander {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Lander properties (smaller for zoomed out view)
        this.lander = {
            x: 400,
            y: 30,
            width: 16,
            height: 24,
            velocityX: 0,
            velocityY: 0,
            fuel: 100,
            thrustPower: 0.25,
            isLanded: false
        };
        
        // Combined input handling from both branches
        this.keys = {};
        this.setupInput();
        
        // Mars surface and landing zones
        this.surface = this.generateSurface();
        this.landingZones = this.generateLandingZones();
        
        this.gameLoop();
    }
    
    setupInput() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    
    generateSurface() {
        const points = [];
        const landingZonePositions = [200, 400, 600]; // Where zones will be
        
        for (let x = 0; x <= 800; x += 25) {
            // Check if this point should be in a flat landing zone
            let isInLandingZone = false;
            let zoneHeight = 0;
            
            for (let zoneX of landingZonePositions) {
                if (Math.abs(x - zoneX) < 60) { // Flat area around zone center
                    isInLandingZone = true;
                    zoneHeight = 480 + (zoneX - 400) * 0.1; // Slight slope across map
                    break;
                }
            }
            
            if (isInLandingZone) {
                points.push({ x: x, y: zoneHeight });
            } else {
                // Rough terrain elsewhere
                points.push({
                    x: x,
                    y: 420 + Math.sin(x * 0.02) * 60 + Math.random() * 80
                });
            }
        }
        return points;
    }
    
    generateLandingZones() {
        return [
            { x: 200, width: 100, label: "LZ-Alpha", type: "primary" },
            { x: 400, width: 120, label: "ISRU-1", type: "isru" },
            { x: 600, width: 80, label: "LZ-Beta", type: "backup" }
        ];
    }
    
    update() {
        if (this.lander.isLanded) return; // Don't update if already landed
        
        // Mars gravity (lighter than original)
        this.lander.velocityY += 0.08;
        
        // Handle input
        this.handleInput();
        
        // Update position
        this.lander.x += this.lander.velocityX;
        this.lander.y += this.lander.velocityY;
        
        // Basic boundary check
        if (this.lander.x < 0) this.lander.x = 0;
        if (this.lander.x > 784) this.lander.x = 784;
        
        // Check for collision
        this.checkCollision();
    }
    
    handleInput() {
        // Combined thruster controls with optimized fuel consumption
        if (this.keys['ArrowUp'] && this.lander.fuel > 0) {
            this.lander.velocityY -= this.lander.thrustPower;
            this.lander.fuel -= 0.6; // Use the more efficient rate from feature branch
        }
        
        if (this.keys['ArrowLeft'] && this.lander.fuel > 0) {
            this.lander.velocityX -= this.lander.thrustPower * 0.4;
            this.lander.fuel -= 0.3;
        }
        
        if (this.keys['ArrowRight'] && this.lander.fuel > 0) {
            this.lander.velocityX += this.lander.thrustPower * 0.4;
            this.lander.fuel -= 0.3;
        }
        
        // Apply realistic flight dynamics from feature branch
        this.lander.velocityX *= 0.98;
    }
    
    checkCollision() {
        // Combined landing system with precise surface collision and zone validation
        for (let i = 0; i < this.surface.length - 1; i++) {
            const point1 = this.surface[i];
            const point2 = this.surface[i + 1];
            
            if (this.lander.x + this.lander.width > point1.x && 
                this.lander.x < point2.x) {
                
                // Precise surface height calculation from feature branch
                const t = (this.lander.x + this.lander.width/2 - point1.x) / (point2.x - point1.x);
                const surfaceY = point1.y + t * (point2.y - point1.y);
                
                if (this.lander.y + this.lander.height >= surfaceY) {
                    // Find which landing zone we're in
                    const currentZone = this.landingZones.find(zone => 
                        Math.abs(this.lander.x + this.lander.width/2 - zone.x) < zone.width/2
                    );
                    
                    const isSoftLanding = this.lander.velocityY < 1.5;
                    const isStableLanding = Math.abs(this.lander.velocityX) < 0.8;
                    const hasEnoughFuel = this.lander.fuel > 10;
                    
                    if (currentZone && currentZone.type === 'isru' && isSoftLanding && isStableLanding && hasEnoughFuel) {
                        console.log("Perfect ISRU landing! 🚀 Equipment deployed successfully.");
                        this.deployISRU();
                        this.lander.isLanded = true;
                    } else if (currentZone && isSoftLanding) {
                        console.log(`Good landing in ${currentZone.label}. Mission success.`);
                        this.lander.isLanded = true;
                    } else if (this.lander.velocityY < 2) {
                        console.log("Rough landing, but crew survives.");
                        this.lander.isLanded = true;
                    } else {
                        console.log("Crash! Mission failed. ❌");
                        this.lander.isLanded = true;
                    }
                    break;
                }
            }
        }
    }
    
    findLandingZone() {
        return this.landingZones.find(zone => zone.type === 'isru');
    }
    
    deployISRU() {
        console.log("🚀 ISRU equipment operational! Beginning resource extraction...");
    }
    
    drawLandingZones() {
        const ctx = this.ctx;
        
        for (let zone of this.landingZones) {
            // Find surface height at this zone
            let surfaceY = 480;
            for (let i = 0; i < this.surface.length - 1; i++) {
                if (this.surface[i].x <= zone.x && this.surface[i + 1].x >= zone.x) {
                    const t = (zone.x - this.surface[i].x) / (this.surface[i + 1].x - this.surface[i].x);
                    surfaceY = this.surface[i].y + t * (this.surface[i + 1].y - this.surface[i].y);
                    break;
                }
            }
            
            // Draw zone marker
            ctx.strokeStyle = zone.type === 'isru' ? '#00ff00' : '#ffff00';
            ctx.lineWidth = 1;
            
            // Landing pad (thicker line for flat zone)
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(zone.x - zone.width/2, surfaceY);
            ctx.lineTo(zone.x + zone.width/2, surfaceY);
            ctx.stroke();
            
            // Zone indicator posts
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(zone.x - zone.width/2, surfaceY);
            ctx.lineTo(zone.x - zone.width/2, surfaceY - 25);
            ctx.moveTo(zone.x + zone.width/2, surfaceY);
            ctx.lineTo(zone.x + zone.width/2, surfaceY - 25);
            ctx.stroke();
            
            // Label
            ctx.fillStyle = zone.type === 'isru' ? '#00ff00' : '#ffff00';
            ctx.font = '9px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(zone.label, zone.x, surfaceY - 30);
        }
    }
    
    drawLander() {
        const ctx = this.ctx;
        const x = this.lander.x + this.lander.width / 2;
        const y = this.lander.y + this.lander.height / 2;
        
        ctx.strokeStyle = '#fff';
        ctx.fillStyle = '#fff';
        ctx.lineWidth = 1;
        
        // Draw smaller Apollo-style lunar module
        ctx.beginPath();
        
        // Main body (descent stage) - smaller
        ctx.rect(x - 6, y - 8, 12, 12);
        
        // Landing legs - smaller
        ctx.moveTo(x - 6, y + 4);
        ctx.lineTo(x - 10, y + 10);
        ctx.moveTo(x + 6, y + 4);
        ctx.lineTo(x + 10, y + 10);
        
        // Ascent stage - smaller
        ctx.rect(x - 4, y - 14, 8, 6);
        
        // Engine nozzle - smaller
        ctx.rect(x - 2, y + 4, 4, 6);
        
        ctx.stroke();
        
        // Landing pads - smaller
        ctx.fillRect(x - 12, y + 9, 4, 2);
        ctx.fillRect(x + 8, y + 9, 4, 2);
    }
    
    draw() {
        // Clear canvas (black space)
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, 800, 600);
        
        // Draw surface (white lines)
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.surface[0].y);
        for (let point of this.surface) {
            this.ctx.lineTo(point.x, point.y);
        }
        this.ctx.stroke();
        
        // Draw landing zones
        this.drawLandingZones();
        
        // Draw lander
        this.drawLander();
        
        // Update UI
        this.updateUI();
    }
    
    updateUI() {
        document.getElementById('fuel').textContent = Math.max(0, Math.round(this.lander.fuel));
        document.getElementById('altitude').textContent = Math.round(Math.max(0, 480 - this.lander.y));
        document.getElementById('velocity').textContent = Math.round(this.lander.velocityY * 10) / 10;
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game
const game = new MarsLander();
