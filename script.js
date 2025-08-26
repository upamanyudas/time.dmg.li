// Configuration
const CONFIG = {
    defaultTimezone: 'UTC',
    defaultFormat: '12',
    timezones: [
        'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
        'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Moscow',
        'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Mumbai', 'Asia/Dubai', 'Asia/Kolkata',
        'Australia/Sydney', 'Australia/Melbourne', 'Pacific/Auckland'
    ]
};

// State
let countdownInterval = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    populateTimezones();
    parseUrlAndConvert();
    initEventListeners();
});

// Tab functionality
function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

// Populate timezone dropdown
function populateTimezones() {
    const select = document.getElementById('timezone-select');
    CONFIG.timezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = tz.replace('_', ' ');
        select.appendChild(option);
    });
}

// Parse URL parameters and convert time
function parseUrlAndConvert() {
    const params = new URLSearchParams(window.location.search);
    const timeParam = params.get('time');
    
    if (!timeParam) return;
    
    const options = {
        time: timeParam,
        tz: params.get('tz') || CONFIG.defaultTimezone,
        date: params.get('date'),
        day: params.get('day'),
        format: params.has('24') ? '24' : '12',
        countdown: params.has('countdown'),
        event: params.has('event'),
        eventname: params.get('eventname'),
        eventdesc: params.get('eventdesc'),
        duration: params.get('duration'),
        endtime: params.get('endtime'),
        enddate: params.get('enddate')
    };
    
    displayConversion(options);
}

// Display converted time
function displayConversion(options) {
    const resultDiv = document.getElementById('result-display');
    const countdownDiv = document.getElementById('countdown-display');
    const eventActions = document.getElementById('event-actions');
    
    try {
        const dateTime = parseDateTime(options);
        const localTime = convertToLocal(dateTime, options.tz);
        
        resultDiv.innerHTML = formatDisplay(localTime, options);
        
        if (options.countdown) {
            showCountdown(dateTime, countdownDiv);
        }
        
        if (options.event) {
            showEventActions(options, dateTime, eventActions);
        }
        
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}

// Parse date and time from various formats
function parseDateTime(options) {
    let date = new Date();
    
    if (options.date) {
        if (options.date.length === 8) {
            // YYYYMMDD format
            const year = options.date.slice(0, 4);
            const month = options.date.slice(4, 6);
            const day = options.date.slice(6, 8);
            date = new Date(`${year}-${month}-${day}`);
        }
    }
    
    if (options.day) {
        date = getNextWeekday(options.day);
    }
    
    // Parse time
    const timeStr = options.time.replace(/[^\d:.]/g, '');
    let hours, minutes = 0;
    
    if (timeStr.includes('.')) {
        [hours, minutes] = timeStr.split('.').map(Number);
    } else if (timeStr.includes(':')) {
        [hours, minutes] = timeStr.split(':').map(Number);
    } else if (timeStr.length === 4) {
        hours = parseInt(timeStr.slice(0, 2));
        minutes = parseInt(timeStr.slice(2, 4));
    } else {
        hours = parseInt(timeStr);
    }
    
    // Handle PM for 12-hour format
    if (options.time.toLowerCase().includes('pm') && hours < 12) {
        hours += 12;
    }
    
    date.setHours(hours, minutes, 0, 0);
    return date;
}

// Convert to local timezone
function convertToLocal(dateTime, fromTz) {
    return new Date(dateTime.toLocaleString('en-US', { timeZone: fromTz }));
}

// Format display
function formatDisplay(dateTime, options) {
    const timeOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: options.format !== '24'
    };
    
    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    const time = dateTime.toLocaleTimeString('en-US', timeOptions);
    const date = dateTime.toLocaleDateString('en-US', dateOptions);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return `
        <div class="time-display">${time}</div>
        <div class="date-display">${date}</div>
        <div class="timezone-display">${timezone}</div>
    `;
}

// Countdown functionality
function showCountdown(targetTime, container) {
    container.classList.remove('hidden');
    
    const updateCountdown = () => {
        const now = new Date();
        const diff = targetTime - now;
        
        if (diff <= 0) {
            container.textContent = 'Time reached!';
            clearInterval(countdownInterval);
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        container.textContent = `${hours}h ${minutes}m ${seconds}s remaining`;
    };
    
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Event actions
function showEventActions(options, startTime, container) {
    container.classList.remove('hidden');
    
    document.getElementById('download-event').onclick = () => {
        downloadCalendarEvent(options, startTime);
    };
}

// Generate calendar event
function downloadCalendarEvent(options, startTime) {
    const endTime = calculateEndTime(startTime, options.duration || '1h');
    const title = options.eventname || 'Event';
    const description = options.eventdesc || '';
    
    const icsContent = generateICS(title, description, startTime, endTime);
    downloadFile(`${title}.ics`, icsContent);
}

// Utility functions
function getNextWeekday(day) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDay = days.indexOf(day.toLowerCase());
    const today = new Date();
    const todayDay = today.getDay();
    const daysUntil = (targetDay - todayDay + 7) % 7 || 7;
    
    const result = new Date(today);
    result.setDate(today.getDate() + daysUntil);
    return result;
}

function calculateEndTime(startTime, duration) {
    const match = duration.match(/(\d+)h?(?:(\d+)m)?/);
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + hours, endTime.getMinutes() + minutes);
    return endTime;
}

function generateICS(title, description, startTime, endTime) {
    const format = date => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TimeSync//EN
BEGIN:VEVENT
UID:${Date.now()}@timesync.app
DTSTART:${format(startTime)}
DTEND:${format(endTime)}
SUMMARY:${title}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Link creator functionality
function initEventListeners() {
    document.getElementById('event-mode').addEventListener('change', function() {
        document.getElementById('event-options').classList.toggle('hidden', !this.checked);
    });
    
    document.getElementById('generate-link').addEventListener('click', generateLink);
    document.getElementById('copy-link').addEventListener('click', copyLink);
}

function generateLink() {
    const time = document.getElementById('time-input').value;
    const date = document.getElementById('date-input').value;
    const timezone = document.getElementById('timezone-select').value;
    
    if (!time) {
        alert('Please select a time');
        return;
    }
    
    const params = new URLSearchParams();
    params.set('time', time);
    if (timezone !== 'UTC') params.set('tz', timezone);
    if (date) params.set('date', date.replace(/-/g, ''));
    if (document.getElementById('format-24').checked) params.set('24', '');
    if (document.getElementById('countdown-mode').checked) params.set('countdown', '');
    
    if (document.getElementById('event-mode').checked) {
        params.set('event', '');
        const eventName = document.getElementById('event-name').value;
        const eventDesc = document.getElementById('event-desc').value;
        const duration = document.getElementById('duration-input').value;
        
        if (eventName) params.set('eventname', eventName);
        if (eventDesc) params.set('eventdesc', eventDesc);
        if (duration) params.set('duration', duration);
    }
    
    const url = window.location.origin + window.location.pathname + '?' + params.toString();
    document.getElementById('link-result').value = url;
    document.getElementById('generated-link').classList.remove('hidden');
}

function copyLink() {
    const linkInput = document.getElementById('link-result');
    linkInput.select();
    document.execCommand('copy');
    
    const button = document.getElementById('copy-link');
    button.textContent = 'Copied!';
    setTimeout(() => button.textContent = 'Copy', 2000);
}