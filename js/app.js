// Configuration
const CONFIG = {
    DEFAULT_TIME: '09:00',
    DEFAULT_END_TIME: '09:00'
};

// Parse URL parameters
function parseParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        time: params.get('time'),
        tz: params.get('tz'),
        day: params.get('day'),
        date: params.get('date'),
        format12: params.has('12') || (!params.has('24')),
        format24: params.has('24'),
        countdown: params.has('countdown'),
        event: params.has('event'),
        eventname: params.get('eventname') || 'Event',
        eventdesc: params.get('eventdesc') || '',
        endtime: params.get('endtime'),
        enddate: params.get('enddate'),
        endtz: params.get('endtz')
    };
}

// Parse time string to Date object
function parseTime(timeStr, dateStr = null, timezone = null) {
    const today = new Date();
    let targetDate = today;

    // Handle date parameter
    if (dateStr) {
        if (dateStr.length === 8) { // YYYYMMDD
            const year = parseInt(dateStr.substr(0, 4));
            const month = parseInt(dateStr.substr(4, 2)) - 1;
            const day = parseInt(dateStr.substr(6, 2));
            targetDate = new Date(year, month, day);
        }
    }

    if (!timeStr) return targetDate;

    // Parse different time formats
    let hours, minutes = 0;
    const lowerTimeStr = timeStr.toLowerCase();
    
    if (timeStr.includes(':') || timeStr.includes('.')) {
        // Format: HH:MM or HH.MM or H:MM or H.MM
        const separator = timeStr.includes(':') ? ':' : '.';
        const parts = lowerTimeStr.split(separator);
        const timePart = parts[0];
        const minutePart = parts[1] || '0';
        
        const isPM = minutePart.includes('pm') || lowerTimeStr.includes('pm');
        const isAM = minutePart.includes('am') || lowerTimeStr.includes('am');
        
        hours = parseInt(timePart);
        minutes = parseInt(minutePart.replace(/[amp]/g, ''));
        
        if (isPM && hours !== 12) hours += 12;
        if (isAM && hours === 12) hours = 0;
    } else if (timeStr.length === 4 && !lowerTimeStr.includes('am') && !lowerTimeStr.includes('pm')) {
        // Format: HHMM (24-hour format)
        hours = parseInt(timeStr.substr(0, 2));
        minutes = parseInt(timeStr.substr(2, 2));
    } else {
        // Format: 3AM, 7PM, 12PM, etc. (single or double digit with AM/PM)
        const isPM = lowerTimeStr.includes('pm');
        const isAM = lowerTimeStr.includes('am');
        
        if (isPM || isAM) {
            hours = parseInt(timeStr.replace(/[amp]/gi, ''));
            minutes = 0;
            
            if (isPM && hours !== 12) hours += 12;
            if (isAM && hours === 12) hours = 0;
        } else {
            // Try to parse as just a number (assume 24-hour format)
            hours = parseInt(timeStr);
            if (isNaN(hours)) return null;
            minutes = 0;
        }
    }

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return null;
    }

    targetDate.setHours(hours, minutes, 0, 0);
    return targetDate;
}

// Parse day parameter with optional time and timezone
function parseDay(dayStr, timeStr = null, timezone = null) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date();
    const currentDay = today.getDay();
    const targetDay = days.indexOf(dayStr.toLowerCase());
    
    if (targetDay === -1) return null;
    
    const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);
    
    // If time is specified, parse it; otherwise default to 9 AM
    if (timeStr) {
        const timeOnly = parseTime(timeStr);
        if (timeOnly) {
            targetDate.setHours(timeOnly.getHours(), timeOnly.getMinutes(), 0, 0);
        } else {
            targetDate.setHours(9, 0, 0, 0);
        }
    } else {
        targetDate.setHours(9, 0, 0, 0);
    }
    
    return targetDate;
}

// Format time for display
function formatTime(date, format24 = false) {
    const options = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: !format24
    };
    return date.toLocaleTimeString('en-US', options);
}

// Format date for display
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Get timezone display name
function getTimezoneDisplay(date) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = -date.getTimezoneOffset() / 60;
    const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;
    return `${timezone} (UTC${offsetStr})`;
}

// Update countdown display
function updateCountdown(targetDate) {
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
        document.getElementById('countdown').textContent = 'Event has started!';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    let countdownText = '';
    if (days > 0) countdownText += `${days}d `;
    if (hours > 0) countdownText += `${hours}h `;
    if (minutes > 0) countdownText += `${minutes}m `;
    countdownText += `${seconds}s`;
    
    document.getElementById('countdown').textContent = `Time remaining: ${countdownText}`;
}

// Main application logic
function initApp() {
    const params = parseParams();
    
    // Check if we have any parameters to process
    if (!params.time && !params.day && !params.date) {
        document.getElementById('welcome').style.display = 'block';
        document.getElementById('result-card').style.display = 'none';
        return;
    }
    
    let targetDate;
    
    // Parse the input
    if (params.day) {
        targetDate = parseDay(params.day, params.time, params.tz);
    } else if (params.time || params.date) {
        targetDate = parseTime(params.time, params.date, params.tz);
    }
    
    if (!targetDate) {
        document.getElementById('welcome').innerHTML = '<h1>Invalid Parameters</h1><p>Please check your URL format</p>';
        return;
    }
    
    // Convert from source timezone to local timezone if source timezone specified  
    if (params.tz) {
        const sourceTimezone = resolveTimezone(params.tz);
        try {
            // Format the target date as it would appear in the source timezone
            const year = targetDate.getFullYear();
            const month = (targetDate.getMonth() + 1).toString().padStart(2, '0'); 
            const day = targetDate.getDate().toString().padStart(2, '0');
            const hours = targetDate.getHours().toString().padStart(2, '0');
            const minutes = targetDate.getMinutes().toString().padStart(2, '0');
            
            // Create a date assuming this time is in the source timezone
            // We'll create it as if it's UTC, then find what UTC time would give us this local time in source TZ
            const testDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
            
            // Get what this time looks like when formatted in the source timezone
            const sourceFormatter = new Intl.DateTimeFormat('sv-SE', {
                timeZone: sourceTimezone,
                year: 'numeric',
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            // Find the UTC time that produces our desired time in the source timezone
            let utcTime = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`);
            
            // Adjust iteratively to find the correct UTC time
            for (let i = 0; i < 5; i++) {
                const formattedInSource = sourceFormatter.format(utcTime);
                const expectedFormat = `${year}-${month}-${day} ${hours}:${minutes}:00`;
                
                if (formattedInSource === expectedFormat) {
                    break;
                }
                
                const actualTime = new Date(formattedInSource.replace(' ', 'T') + 'Z');
                const expectedTime = new Date(expectedFormat.replace(' ', 'T') + 'Z');
                const diff = expectedTime.getTime() - actualTime.getTime();
                utcTime = new Date(utcTime.getTime() + diff);
            }
            
            targetDate = utcTime;
            
        } catch (e) {
            console.warn('Timezone conversion failed:', params.tz, e);
            // Fallback: treat as if no timezone was specified
        }
    }
    
    // Display the result
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('navigation').style.display = 'none';
    document.querySelector("header").style.borderBottom = 'none';
    document.getElementById('result-card').style.display = 'block';
    
    const format24 = params.format24;
    document.getElementById('time-display').textContent = formatTime(targetDate, format24);
    document.getElementById('date-display').textContent = formatDate(targetDate);
    document.getElementById('timezone-display').textContent = getTimezoneDisplay(targetDate);
    
    // Handle countdown
    if (params.countdown) {
        document.getElementById('countdown').style.display = 'block';
        updateCountdown(targetDate);
        setInterval(() => updateCountdown(targetDate), 1000);
    }
    
    // Handle event creation
    if (params.event) {
        let endDate = targetDate;
        
        if (params.endtime || params.enddate) {
            endDate = parseTime(params.endtime || CONFIG.DEFAULT_END_TIME, 
                              params.enddate, params.endtz || params.tz);
        } else {
            // Default to 1 hour duration
            endDate = new Date(targetDate.getTime() + 60 * 60 * 1000);
        }
        
        const event = {
            title: params.eventname,
            description: params.eventdesc.replace(/\\n/g, '\n'),
            start: targetDate,
            end: endDate
        };
        
        document.getElementById('download-btn').style.display = 'inline-block';
        document.getElementById('download-btn').onclick = () => downloadICAL(event);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);