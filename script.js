document.addEventListener('DOMContentLoaded', function() {
    // Game state
    let foundItems = [];
    const totalItems = 5;
    const foundCountElement = document.getElementById('foundCount');
    const finalReveal = document.getElementById('finalReveal');
    const confettiCanvas = document.getElementById('confettiCanvas');
    const ctx = confettiCanvas.getContext('2d');
    const youtubeEmbed = document.getElementById('youtubeEmbed');
    const currentSongElement = document.getElementById('currentSong');
    const songInput = document.getElementById('songInput');
    
    // Your YouTube song (Jtdun2YB5Zo is the video ID from your link)
    let currentVideoId = 'Jtdun2YB5Zo';
    let currentSongName = "Your Special Song";
    
    // Initialize canvas size
    function resizeCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
    
    // Load YouTube embed
    function loadYouTubeEmbed(videoId, songName = null) {
        if (songName) {
            currentSongName = songName;
            currentSongElement.textContent = songName;
        }
        
        // Extract video ID if full URL is provided
        if (videoId.includes('youtu.be/')) {
            videoId = videoId.split('youtu.be/')[1].split('?')[0];
        } else if (videoId.includes('youtube.com/watch?v=')) {
            videoId = videoId.split('v=')[1].split('&')[0];
        }
        
        currentVideoId = videoId;
        
        youtubeEmbed.innerHTML = `
            <iframe 
                width="100%" 
                height="315" 
                src="https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&theme=dark&color=purple" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
        
        // Save to localStorage
        localStorage.setItem('customVideoId', videoId);
        localStorage.setItem('customSongName', currentSongName);
    }
    
    // Load saved song or default
    function initializeSong() {
        const savedVideoId = localStorage.getItem('customVideoId');
        const savedSongName = localStorage.getItem('customSongName');
        
        if (savedVideoId) {
            currentVideoId = savedVideoId;
            currentSongName = savedSongName || "Your Custom Song";
            loadYouTubeEmbed(currentVideoId, currentSongName);
        } else {
            // Load your default song
            loadYouTubeEmbed(currentVideoId, "Your Special Song");
        }
    }
    
    initializeSong();
    
    // Pre-fill with your song
    songInput.value = 'https://youtu.be/Jtdun2YB5Zo?si=YFBa6nyQJuTOC8bn';
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Confetti particles
    const confettiParticles = [];
    const confettiColors = ['#ff9ee5', '#c77dff', '#9d4edd', '#7b2cbf', '#ffd6ff', '#e0aaff'];
    
    // Item click handler
    document.querySelectorAll('.item').forEach(item => {
        item.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            
            // If already found, do nothing
            if (foundItems.includes(itemId)) return;
            
            // Add to found items
            foundItems.push(itemId);
            
            // Update UI
            this.classList.add('found');
            this.querySelector('.hint').textContent = 'Found! 🎉';
            
            // Reveal corresponding fragment
            const fragment = document.querySelector(`.fragment[data-fragment="${itemId}"]`);
            fragment.classList.add('revealed');
            
            // Update counter
            foundCountElement.textContent = foundItems.length;
            
            // Play found sound
            playFoundSound();
            
            // Check if all items are found
            if (foundItems.length === totalItems) {
                // Show final message after a delay
                setTimeout(() => {
                    finalReveal.classList.add('show');
                    
                    // Start confetti
                    startConfetti();
                    
                    // Play celebration sound
                    playCelebrationSound();
                    
                    // Scroll to final message
                    setTimeout(() => {
                        finalReveal.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 500);
                }, 800);
            }
        });
    });
    
    // Sound effects
    function playFoundSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 523.25; // C5
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log("Audio not supported");
        }
    }
    
    function playCelebrationSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Play a chord
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
            
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 1);
                }, index * 100);
            });
        } catch (e) {
            console.log("Audio not supported");
        }
    }
    
    // Replay button
    document.getElementById('replayBtn').addEventListener('click', function() {
        // Reset game
        foundItems = [];
        foundCountElement.textContent = '0';
        
        // Reset items
        document.querySelectorAll('.item').forEach(item => {
            item.classList.remove('found');
            item.querySelector('.hint').textContent = 'Click me';
        });
        
        // Reset fragments
        document.querySelectorAll('.fragment').forEach(fragment => {
            fragment.classList.remove('revealed');
        });
        
        // Hide final reveal
        finalReveal.classList.remove('show');
        
        // Stop confetti
        confettiParticles.length = 0;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Update song button
    document.getElementById('updateSongBtn').addEventListener('click', function() {
        const songInputValue = songInput.value.trim();
        
        if (songInputValue) {
            // Extract video ID
            let videoId = songInputValue;
            let songName = "Your Custom Song";
            
            // Try to extract video ID from different YouTube URL formats
            if (songInputValue.includes('youtu.be/')) {
                videoId = songInputValue.split('youtu.be/')[1].split('?')[0];
            } else if (songInputValue.includes('youtube.com/watch?v=')) {
                videoId = songInputValue.split('v=')[1].split('&')[0];
            }
            
            // Update the song
            loadYouTubeEmbed(videoId, songName);
            
            // Show success message with animation
            const btn = this;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Updated!';
            btn.style.background = 'linear-gradient(45deg, #48bb78, #38a169)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = 'linear-gradient(45deg, #9d4edd, #7b2cbf)';
            }, 2000);
            
            // Clear input
            songInput.value = '';
        } else {
            alert('Please enter a YouTube song link.');
        }
    });
    
    // Allow Enter key to update song
    songInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('updateSongBtn').click();
        }
    });
    
    // Confetti functions
    function createConfettiParticle() {
        return {
            x: Math.random() * confettiCanvas.width,
            y: -10,
            size: Math.random() * 12 + 6,
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 3 + 2,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            shape: Math.random() > 0.5 ? 'circle' : 'rectangle',
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 6 - 3,
            sway: Math.random() * 0.05
        };
    }
    
    function startConfetti() {
        // Create initial particles
        for (let i = 0; i < 200; i++) {
            confettiParticles.push(createConfettiParticle());
        }
        
        // Start animation
        animateConfetti();
    }
    
    function animateConfetti() {
        // Clear canvas with a slight fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        // Update and draw particles
        for (let i = 0; i < confettiParticles.length; i++) {
            const p = confettiParticles[i];
            
            // Update position with sway
            p.x += p.speedX + Math.sin(Date.now() * 0.001 + p.x) * p.sway;
            p.y += p.speedY;
            p.rotation += p.rotationSpeed;
            
            // Add gravity
            p.speedY += 0.05;
            
            // Draw particle
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation * Math.PI / 180);
            ctx.fillStyle = p.color;
            
            if (p.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            }
            
            ctx.restore();
            
            // Remove particles that are off screen
            if (p.y > confettiCanvas.height || p.x < -50 || p.x > confettiCanvas.width + 50) {
                // Occasionally add new particles
                if (Math.random() > 0.9 && confettiParticles.length < 250) {
                    confettiParticles.push(createConfettiParticle());
                }
                
                // Remove this particle
                confettiParticles.splice(i, 1);
                i--;
            }
        }
        
        // Continue animation if there are particles
        if (confettiParticles.length > 0) {
            requestAnimationFrame(animateConfetti);
        }
    }
    
    // Add some initial animations
    setTimeout(() => {
        document.querySelectorAll('.item').forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    item.style.transform = '';
                }, 500);
            }, index * 200);
        });
    }, 1000);
});
