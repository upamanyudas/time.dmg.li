// Common timezone mappings and data
const TIMEZONES = {
    // Common abbreviations to IANA names
    'ACDT': 'Australia/Adelaide',
    'ACST': 'Australia/Adelaide',
    'ACWST': 'Australia/Eucla',
    'ADT': 'America/Halifax',
    'AEDT': 'Australia/Sydney',
    'AEST': 'Australia/Sydney',
    'AFT': 'Asia/Kabul',
    'AKDT': 'America/Anchorage',
    'AKST': 'America/Anchorage',
    'AST': 'America/Halifax',
    'BDT': 'Asia/Dhaka',
    'BRT': 'America/Sao_Paulo',
    'BRST': 'America/Sao_Paulo',
    'BST': 'Europe/London',
    'CCT': 'Indian/Cocos',
    'CDT': 'America/Chicago',
    'CEST': 'Europe/Paris',
    'CET': 'Europe/Paris',
    'CHADT': 'Pacific/Chatham',
    'CHAST': 'Pacific/Chatham',
    'CST': 'America/Chicago',
    'CVT': 'Atlantic/Cape_Verde',
    'EAT': 'Africa/Nairobi',
    'EDT': 'America/New_York',
    'EST': 'America/New_York',
    'FJT': 'Pacific/Fiji',
    'FJST': 'Pacific/Fiji',
    'GMT': 'Europe/London',
    'GST': 'Asia/Dubai',
    'HST': 'Pacific/Honolulu',
    'ICT': 'Asia/Bangkok',
    'IRDT': 'Asia/Tehran',
    'IRST': 'Asia/Tehran',
    'IST': 'Asia/Kolkata',
    'JST': 'Asia/Tokyo',
    'KST': 'Asia/Seoul',
    'LHDT': 'Australia/Lord_Howe',
    'LHST': 'Australia/Lord_Howe',
    'LINT': 'Pacific/Kiritimati',
    'MART': 'Pacific/Marquesas',
    'MDT': 'America/Denver',
    'MSK': 'Europe/Moscow',
    'MST': 'America/Denver',
    'NDT': 'America/St_Johns',
    'NST': 'America/St_Johns',
    'NPT': 'Asia/Kathmandu',
    'NUT': 'Pacific/Niue',
    'NZDT': 'Pacific/Auckland',
    'NZST': 'Pacific/Auckland',
    'PDT': 'America/Los_Angeles',
    'PKT': 'Asia/Karachi',
    'PST': 'America/Los_Angeles',
    'SGT': 'Asia/Singapore',
    'SST': 'Pacific/Midway',
    'TOT': 'Pacific/Tongatapu',
    'UTC': 'UTC'
};

// Major world timezones for dropdown
const MAJOR_TIMEZONES = [
    { value: 'Pacific/Midway', label: 'SST - Midway' }, // -12:00
    { value: 'Pacific/Niue', label: 'NUT - Niue' }, // -11:00
    { value: 'Pacific/Honolulu', label: 'HST - Honolulu' }, // -10:00
    { value: 'Pacific/Marquesas', label: 'MART - Marquesas' }, // -09:30
    { value: 'America/Anchorage', label: 'AKST/AKDT - Anchorage' }, // -09:00/-08:00
    { value: 'America/Los_Angeles', label: 'PST/PDT - Pacific Time' }, // -08:00/-07:00
    { value: 'America/Denver', label: 'MST/MDT - Mountain Time' }, // -07:00/-06:00
    { value: 'America/Chicago', label: 'CST/CDT - Central Time' }, // -06:00/-05:00
    { value: 'America/New_York', label: 'EST/EDT - Eastern Time' }, // -05:00/-04:00
    { value: 'America/Sao_Paulo', label: 'BRT/BRST - Sao Paulo' }, // -03:00/-02:00
    { value: 'America/St_Johns', label: 'NST/NDT - Newfoundland' }, // -03:30/-02:30
    { value: 'Atlantic/South_Georgia', label: 'GST - South Georgia' }, // -02:00
    { value: 'Atlantic/Cape_Verde', label: 'CVT - Cape Verde' }, // -01:00
    { value: 'UTC', label: 'UTC - Coordinated Universal Time' }, // +00:00
    { value: 'Europe/London', label: 'GMT/BST - London' }, // +00:00/+01:00
    { value: 'Europe/Paris', label: 'CET/CEST - Paris' }, // +01:00/+02:00
    { value: 'Europe/Moscow', label: 'MSK - Moscow' }, // +03:00
    { value: 'Asia/Tehran', label: 'IRST - Tehran' }, // +03:30
    { value: 'Asia/Dubai', label: 'GST - Dubai' }, // +04:00
    { value: 'Asia/Kabul', label: 'AFT - Kabul' }, // +04:30
    { value: 'Asia/Karachi', label: 'PKT - Karachi' }, // +05:00
    { value: 'Asia/Kolkata', label: 'IST - Kolkata' }, // +05:30
    { value: 'Asia/Kathmandu', label: 'NPT - Kathmandu' }, // +05:45
    { value: 'Asia/Dhaka', label: 'BDT - Dhaka' }, // +06:00
    { value: 'Indian/Cocos', label: 'CCT - Cocos Islands' }, // +06:30
    { value: 'Asia/Bangkok', label: 'ICT - Bangkok' }, // +07:00
    { value: 'Asia/Shanghai', label: 'CST - Shanghai' }, // +08:00
    { value: 'Australia/Eucla', label: 'ACWST - Eucla' }, // +08:45
    { value: 'Asia/Tokyo', label: 'JST - Tokyo' }, // +09:00
    { value: 'Australia/Adelaide', label: 'ACST/ACDT - Adelaide' }, // +09:30/+10:30
    { value: 'Australia/Sydney', label: 'AEST/AEDT - Sydney' }, // +10:00/+11:00
    { value: 'Australia/Lord_Howe', label: 'LHST/LHDT - Lord Howe' }, // +10:30/+11:00
    { value: 'Pacific/Auckland', label: 'NZST/NZDT - Auckland' }, // +12:00/+13:00
    { value: 'Pacific/Chatham', label: 'CHAST/CHADT - Chatham' }, // +12:45/+13:45
    { value: 'Pacific/Kiritimati', label: 'LINT - Kiritimati' } // +14:00
];

// Helper function to resolve timezone
function resolveTimezone(tz) {
    if (!tz) return Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONES[tz.toUpperCase()] || tz;
}