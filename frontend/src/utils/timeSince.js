export default function timeSince(date) {
    if (typeof date !== 'object') {
        date = new Date(date);
    }

    let seconds = Math.floor((new Date() - date) / 1000);
    let intervalType;

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
        intervalType = 'y';
    } else {
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            intervalType = 'm';
        } else {
            interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                intervalType = 'd';
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                    intervalType = "h";
                } else {
                    interval = Math.floor(seconds / 60);
                    if (interval >= 1) {
                        intervalType = "m";
                    } else {
                        interval = seconds;
                        intervalType = "s";
                    }
                }
            }
        }
    }

    if (interval > 1 || interval === 0) {
        //   intervalType += 's';
    }

    if (intervalType === "s" && interval < 10) {
        return "now"
    }

    return interval + '' + intervalType;
};
