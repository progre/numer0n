/** 幅がtotalWidthになるまでstrの左側にpaddingCharを詰める */
export function padLeft(str: string, totalWidth: number, paddingChar: string) {
    var padStr = str;
    while (padStr.length < totalWidth) {
        padStr = paddingChar + padStr;
    }
    return padStr.substring(0, totalWidth);
}

/** 幅がtotalWidthになるまでstrの右側にpaddingCharを詰める */
export function padRight(str: string, totalWidth: number, paddingChar: string) {
    var padStr = str;
    while (padStr.length < totalWidth) {
        padStr += paddingChar;
    }
    return padStr.substring(0, totalWidth);
}