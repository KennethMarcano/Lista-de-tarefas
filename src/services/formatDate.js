export default function formatDate(dateString) {
    const date = dateString.slice(0, 10).split('/');
    const hour = dateString.slice(11).split(':');
    date.reverse();
    date[1] = (parseInt(date[1]) - 1).toString();
    return new Date(date[0], date[1], date[2], hour[0], hour[1]);
}