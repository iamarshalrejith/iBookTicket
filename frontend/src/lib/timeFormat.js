const timeFormat = (minutes) => {
    const hours = Math.floor(minutes/60);
    const minRemain = minutes % 60;
    return `${hours}hr ${minRemain}min`
}

export default timeFormat;