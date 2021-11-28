export function shuffle<T>(originalArray: Array<T>): Array<T> {
    return [...originalArray].reduce((acc, item, index): Array<T> => {
        const replacementIndex = Math.floor(Math.random() * (index + 1));
        originalArray[index] = originalArray[replacementIndex];
        originalArray[replacementIndex] = item;
        return originalArray;
    }, originalArray);
}