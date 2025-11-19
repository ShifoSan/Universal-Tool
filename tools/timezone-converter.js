// Time Zone Converter Logic

// Update local time display
function updateLocalTime() {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    document.getElementById('localTime').textContent = now.toLocaleTimeString('en-US', timeOptions);
    document.getElementById('localDate').textContent = now.toLocaleDateString('en-US', dateOptions);
}

// Initialize with current date and time
function initializeDateTime() {
    const now = new Date();
    
    // Set date input to today
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    document.getElementById('fromDate').value = `${year}-${month}-${day}`;
    
    // Set time input to current time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('fromTime').value = `${hours}:${minutes}`;
}

// Convert time between timezones
function convertTime() {
    const fromTimezone = document.getElementById('fromTimezone').value;
    const toTimezone = document.getElementById('toTimezone').value;
    const dateValue = document.getElementById('fromDate').value;
    const timeValue = document.getElementById('fromTime').value;
    
    if (!dateValue || !timeValue) {
        alert('Please select both date and time');
        return;
    }
    
    // Create date object
    const dateTimeString = `${dateValue}T${timeValue}:00`;
    const sourceDate = new Date(dateTimeString);
    
    // Get UTC timestamp
    const utcTime = sourceDate.getTime();
    
    // Convert to target timezone
    const targetDate = new Date(utcTime);
    
    // Format output
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true,
        timeZone: toTimezone
    };
    
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: toTimezone
    };
    
    const resultTime = targetDate.toLocaleTimeString('en-US', timeOptions);
    const resultDate = targetDate.toLocaleDateString('en-US', dateOptions);
    
    // Get timezone abbreviation
    const timezoneName = getTimezoneAbbreviation(toTimezone);
    
    // Display results
    document.getElementById('resultTime').textContent = resultTime;
    document.getElementById('resultDate').textContent = resultDate;
    document.getElementById('resultTimezone').textContent = timezoneName;
    document.getElementById('resultCard').style.display = 'block';
    
    // Scroll to result
    document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Get timezone abbreviation/name
function getTimezoneAbbreviation(timezone) {
    const timezoneMap = {
        'UTC': 'UTC - Coordinated Universal Time',
        'America/New_York': 'Eastern Time (ET)',
        'America/Los_Angeles': 'Pacific Time (PT)',
        'America/Chicago': 'Central Time (CT)',
        'Europe/London': 'British Time (GMT/BST)',
        'Europe/Paris': 'Central European Time (CET)',
        'Europe/Berlin': 'Central European Time (CET)',
        'Asia/Tokyo': 'Japan Standard Time (JST)',
        'Asia/Shanghai': 'China Standard Time (CST)',
        'Asia/Kolkata': 'India Standard Time (IST)',
        'Asia/Dubai': 'Gulf Standard Time (GST)',
        'Australia/Sydney': 'Australian Eastern Time (AET)',
        'Pacific/Auckland': 'New Zealand Time (NZT)'
    };
    
    return timezoneMap[timezone] || timezone;
}

// Swap timezones
function swapTimezones() {
    const fromTimezone = document.getElementById('fromTimezone');
    const toTimezone = document.getElementById('toTimezone');
    
    const temp = fromTimezone.value;
    fromTimezone.value = toTimezone.value;
    toTimezone.value = temp;
    
    // Add visual feedback
    document.getElementById('swapBtn').style.transform = 'rotate(180deg)';
    setTimeout(() => {
        document.getElementById('swapBtn').style.transform = 'rotate(0deg)';
    }, 300);
}

// Handle preset buttons
function handlePreset(preset) {
    const now = new Date();
    let targetDate = new Date();
    
    switch(preset) {
        case 'now':
            // Already set to now
            break;
        case 'tomorrow':
            targetDate.setDate(now.getDate() + 1);
            break;
        case 'next-week':
            targetDate.setDate(now.getDate() + 7);
            break;
        case 'meeting':
            targetDate.setHours(14, 0, 0, 0); // 2 PM
            break;
    }
    
    // Update inputs
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    document.getElementById('fromDate').value = `${year}-${month}-${day}`;
    
    const hours = String(targetDate.getHours()).padStart(2, '0');
    const minutes = String(targetDate.getMinutes()).padStart(2, '0');
    document.getElementById('fromTime').value = `${hours}:${minutes}`;
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize
    updateLocalTime();
    initializeDateTime();
    setInterval(updateLocalTime, 1000);
    
    // Convert button
    document.getElementById('convertBtn').addEventListener('click', convertTime);
    
    // Swap button
    document.getElementById('swapBtn').addEventListener('click', swapTimezones);
    
    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.getAttribute('data-preset');
            handlePreset(preset);
        });
    });
    
    // Enter key support
    document.querySelectorAll('.timezone-select, .date-input, .time-input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                convertTime();
            }
        });
    });
});