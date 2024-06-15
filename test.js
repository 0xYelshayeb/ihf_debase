const getTimeStamp = () => {
    const now = new Date();
    return `${now.toISOString()}`;
};

console.log(getTimeStamp())