const getChannelName = (name: string) => {
    if (name.length > 18) {
        return name.slice(0, 18) + "...";
    } else {
        return name;
    }
};

export default getChannelName;