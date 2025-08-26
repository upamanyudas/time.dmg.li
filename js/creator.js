// Populate timezone dropdowns
function populateTimezones() {
    const timezoneSelect = document.getElementById('timezone');
    const endTimezoneSelect = document.getElementById('endtimezone');
    
    MAJOR_TIMEZONES.forEach(tz => {
        const option1 = document.createElement('option');
        option1.value = tz.value;
        option1.textContent = tz.label;
        timezoneSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = tz.value;
        option2.textContent = tz.label;
        endTimezoneSelect.appendChild(option2);
    });
}

// Format time for URL
function formatTimeForURL(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    if (minutes === 0) {
        if (hours === 0) return '12AM';
        if (hours === 12) return '12PM';
        if (hours > 12) return `${hours - 12}PM`;
        return `${hours}AM`;
    }
    
    const minuteStr = minutes.toString().padStart(2, '0');
    if (hours === 0) return `12.${minuteStr}AM`;
    if (hours === 12) return `12.${minuteStr}PM`;
    if (hours > 12) return `${hours - 12}.${minuteStr}PM`;
    return `${hours}.${minuteStr}AM`;
}

// Generate URL from form
function generateURL() {
    const datetime = document.getElementById('datetime').value;
    const timezone = document.getElementById('timezone').value;
    const format = document.querySelector('input[name="format"]:checked').value;
    const countdown = document.getElementById('countdown').checked;
    const event = document.getElementById('event').checked;
    const eventname = document.getElementById('eventname').value;
    const eventdesc = document.getElementById('eventdesc').value;
    const endtime = document.getElementById('endtime').value;
    const endtimezone = document.getElementById('endtimezone').value;
    
    if (!datetime) {
        document.getElementById('generated-url').textContent = 'Please select a date and time';
        return;
    }
    
    const date = new Date(datetime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    const params = new URLSearchParams();
    
    // Add time parameter
    params.set('time', formatTimeForURL(date));
    
    // Add date parameter if not today
    if (selectedDate.getTime() !== today.getTime()) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        params.set('date', `${year}${month}${day}`);
    }
    
    // Add timezone if specified
    if (timezone) {
        const abbrev = Object.keys(TIMEZONES).find(key => TIMEZONES[key] === timezone);
        params.set('tz', abbrev || timezone);
    }
    
    // Add format
    if (format === '24') {
        params.set('24', '');
    }
    
    // Add countdown
    if (countdown) {
        params.set('countdown', '');
    }
    
    // Add event parameters
    if (event) {
        params.set('event', '');
        
        if (eventname) {
            params.set('eventname', eventname);
        }
        
        if (eventdesc) {
            params.set('eventdesc', eventdesc);
        }
        
        if (endtime) {
            const endDate = new Date(endtime);
            params.set('endtime', formatTimeForURL(endDate));
            
            // Add enddate if different from start date
            const endDateOnly = new Date(endDate);
            endDateOnly.setHours(0, 0, 0, 0);
            
            if (endDateOnly.getTime() !== selectedDate.getTime()) {
                const endYear = endDate.getFullYear();
                const endMonth = (endDate.getMonth() + 1).toString().padStart(2, '0');
                const endDay = endDate.getDate().toString().padStart(2, '0');
                params.set('enddate', `${endYear}${endMonth}${endDay}`);
            }
        }
        
        if (endtimezone && endtimezone !== timezone) {
            const endAbbrev = Object.keys(TIMEZONES).find(key => TIMEZONES[key] === endtimezone);
            params.set('endtz', endAbbrev || endtimezone);
        }
    }
    
    const baseURL = window.location.origin;
    const fullURL = `${baseURL}/?${params.toString()}`;
    
    document.getElementById('generated-url').innerHTML = `
        <strong>Generated URL:</strong><br>
        <a href="${fullURL}" target="_blank">${fullURL}</a>
    `;
}

// Toggle event options
function toggleEventOptions() {
    const event = document.getElementById('event').checked;
    document.getElementById('event-options').style.display = event ? 'block' : 'none';
    generateURL();
}

// Initialize creator page
function initCreator() {
    populateTimezones();
    
    // Add event listeners
    document.getElementById('datetime').addEventListener('change', generateURL);
    document.getElementById('timezone').addEventListener('change', generateURL);
    document.querySelectorAll('input[name="format"]').forEach(radio => {
        radio.addEventListener('change', generateURL);
    });
    document.getElementById('countdown').addEventListener('change', generateURL);
    document.getElementById('event').addEventListener('change', toggleEventOptions);
    document.getElementById('eventname').addEventListener('input', generateURL);
    document.getElementById('eventdesc').addEventListener('input', generateURL);
    document.getElementById('endtime').addEventListener('change', generateURL);
    document.getElementById('endtimezone').addEventListener('change', generateURL);
    
    // Set default datetime to current time + 1 hour
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    document.getElementById('datetime').value = now.toISOString().slice(0, 16);
    
    generateURL();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCreator);