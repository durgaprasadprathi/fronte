export const capitalizeFirstLetter = (string:string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const capitalizeAttribute = (string:string) => {
    if (string) {
        let _word = string.replace(/_/g, " ");
        _word = capitalizeFirstLetter(_word);
        return _word;
    }
    else {
        return "";
    }
}