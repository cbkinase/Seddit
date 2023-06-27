export default function timeSince(date) {
    if (typeof date !== 'object') {
        date = new Date(date);
    }

    let seconds = Math.floor((new Date() - date) / 1000);
    let intervalType;

    // Array of intervals and their corresponding symbols.
    const intervals = [
        { value: 31536000, symbol: 'y' },
        { value: 2592000, symbol: 'm' },
        { value: 86400, symbol: 'd' },
        { value: 3600, symbol: 'h' },
        { value: 60, symbol: 'm' },
        { value: 1, symbol: 's' },
    ];

    for (let i = 0; i < intervals.length; i++) {
        let interval = Math.floor(seconds / intervals[i].value);
        if (interval >= 1) {
            intervalType = intervals[i].symbol;
            // If the interval is more than or equal to 1, we found our interval.
            return interval + intervalType;
        }
    }

    // If the code reaches this point, it means the time since is less than 1 second.
    return "now";
};
