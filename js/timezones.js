// Common timezone mappings and data
const TIMEZONES = {
    // Common abbreviations to IANA names
    'EST': 'America/New_York',
    'PST': 'America/Los_Angeles',
    'CST': 'America/Chicago',
    'MST': 'America/Denver',
    'IST': 'Asia/Kolkata',
    'GMT': 'Europe/London',
    'UTC': 'UTC',
    'JST': 'Asia/Tokyo',
    'AEST': 'Australia/Sydney',
    'CET': 'Europe/Paris'
};

// Major world timezones for dropdown
const MAJOR_TIMEZONES = [
    { value: 'UTC', label: 'UTC - Coordinated Universal Time' },
    { value: 'America/New_York', label: 'EST/EDT - Eastern Time' },
    { value: 'America/Chicago', label: 'CST/CDT - Central Time' },
    { value: 'America/Denver', label: 'MST/MDT - Mountain Time' },
    { value: 'America/Los_Angeles', label: 'PST/PDT - Pacific Time' },
    { value: 'Europe/London', label: 'GMT/BST - London' },
    { value: 'Europe/Paris', label: 'CET/CEST - Paris' },
    { value: 'Europe/Berlin', label: 'CET/CEST - Berlin' },
    { value: 'Asia/Tokyo', label: 'JST - Tokyo' },
    { value: 'Asia/Shanghai', label: 'CST - Shanghai' },
    { value: 'Asia/Kolkata', label: 'IST - India' },
    { value: 'Asia/Dubai', label: 'GST - Dubai' },
    { value: 'Australia/Sydney', label: 'AEST/AEDT - Sydney' },
    { value: 'Pacific/Auckland', label: 'NZST/NZDT - Auckland' }
];

// Helper function to resolve timezone
function resolveTimezone(tz) {
    if (!tz) return Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONES[tz.toUpperCase()] || tz;
}