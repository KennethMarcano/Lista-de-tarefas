export default function formatDate(date) {
    const dates = date.split('-');
    dates.reverse();
    if (dates[1].lenght < 2) {
        dates[1] = dates[1].padStart(2, '0')
    }

    if (dates[2].lenght < 2) {
        dates[2] = dates[2].toString().padStart(2, '0');
    }
    dates[2] = dates[2] + 'T00:00:00';
    dates[0] = '20' + dates[0];
    return dates.join('-');
}