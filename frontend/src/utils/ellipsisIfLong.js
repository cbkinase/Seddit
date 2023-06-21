export default function ellipsisIfLong(paragraph, long = 20) {
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

    if (wordArr.length < long && paragraph.length > 100) {
        return paragraph.slice(0, 100) + "...";
    }
    return paragraph;
};
