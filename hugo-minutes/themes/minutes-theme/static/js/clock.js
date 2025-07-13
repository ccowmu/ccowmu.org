// ===== CLOCK WIDGET =====
// Real-time clock display in the header

let clockInterval;

function initClock() {
    const clockDisplay = document.getElementById('current-time');
    
    if (!clockDisplay) {
        // If clock element isn't loaded yet, try again in 100ms
        setTimeout(initClock, 100);
        return;
    }
    
    function updateClock() {
        const now = new Date();
        
        // Format time as HH:MM:SS
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        const timeString = `${hours}:${minutes}:${seconds}`;
        clockDisplay.textContent = timeString;
        
        // Add subtle color change effect based on seconds
        const hue = (now.getSeconds() * 6) % 360; // 0-360 degrees
        clockDisplay.style.filter = `hue-rotate(${hue}deg)`;
    }
    
    // Update immediately
    updateClock();
    
    // Clear existing interval if any
    if (clockInterval) {
        clearInterval(clockInterval);
    }
    
    // Update every second
    clockInterval = setInterval(updateClock, 1000);
}

// Alternative clock formats for special occasions
function getSpecialTimeFormat() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // Halloween (October 31)
    if (month === 10 && day === 31) {
        return getHexTime();
    }
    
    // Pi Day (March 14)
    if (month === 3 && day === 14) {
        return getPiTime();
    }
    
    // Binary Day (random chance)
    if (Math.random() < 0.001) { // 0.1% chance
        return getBinaryTime();
    }
    
    return null;
}

function getHexTime() {
    const now = new Date();
    const hex = now.getTime().toString(16).toUpperCase().slice(-6);
    return `0x${hex}`;
}

function getPiTime() {
    const now = new Date();
    const pi = '3.14159265359';
    const timeIndex = (now.getSeconds() + now.getMinutes() * 60) % pi.length;
    return pi.slice(0, timeIndex + 1);
}

function getBinaryTime() {
    const now = new Date();
    const hours = now.getHours().toString(2).padStart(8, '0');
    const minutes = now.getMinutes().toString(2).padStart(8, '0');
    return `${hours}:${minutes}`;
}

// Unix timestamp display (Easter egg)
function showUnixTime() {
    const clockDisplay = document.getElementById('current-time');
    const clockLabel = document.querySelector('.clock-label');
    
    if (clockDisplay && clockLabel) {
        const unixTime = Math.floor(Date.now() / 1000);
        clockDisplay.textContent = unixTime;
        clockLabel.textContent = 'UNIX';
        
        // Return to normal after 5 seconds
        setTimeout(() => {
            clockLabel.textContent = 'LOCAL';
            initClock();
        }, 5000);
    }
}

// UTC time display
function showUTCTime() {
    const clockDisplay = document.getElementById('current-time');
    const clockLabel = document.querySelector('.clock-label');
    
    if (clockDisplay && clockLabel) {
        const now = new Date();
        const utcTime = now.toUTCString().split(' ')[4]; // Extract time part
        clockDisplay.textContent = utcTime;
        clockLabel.textContent = 'UTC';
        
        // Return to normal after 5 seconds
        setTimeout(() => {
            clockLabel.textContent = 'LOCAL';
            initClock();
        }, 5000);
    }
}

// Click handlers for clock
document.addEventListener('DOMContentLoaded', function() {
    // Add click handler after clock is loaded
    setTimeout(() => {
        const clockDisplay = document.getElementById('clock-display');
        if (clockDisplay) {
            let clickCount = 0;
            
            clockDisplay.addEventListener('click', function() {
                clickCount++;
                
                if (clickCount === 1) {
                    showUTCTime();
                    setTimeout(() => { clickCount = 0; }, 6000);
                } else if (clickCount === 2) {
                    showUnixTime();
                    clickCount = 0;
                }
            });
        }
    }, 1000);
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (clockInterval) {
        clearInterval(clockInterval);
    }
});
