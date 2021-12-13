const toLocale = (number, percent = false) => {
    return Math.abs(number).toLocaleString('RU-ru', {
        style: !percent ? 'currency' : 'percent',
        currency: 'USD'
    });
}

export default toLocale;