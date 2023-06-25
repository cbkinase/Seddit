export default function ellipsisIfLong(paragraph, long = 20, shortWord=false, wordLen = 40) {
    if (!paragraph) return null;
    let wordArr = paragraph.split(" ");
    let newStr = "";
    if (wordArr.length > long) {
        for (let i = 0; i < long; i++) {
            newStr += wordArr[i];
            if (i !== long - 1) newStr += " ";
        }

        newStr += "...";
        return newStr;
    }

    const cutoff = shortWord ? wordLen : 100;
    if (wordArr.length < long && paragraph.length > cutoff) {
        return paragraph.slice(0, cutoff) + "...";
    }
    return paragraph;
};
