import cutil = require('./../../../common/util');

export function to0PaddedString(num: number) {
    return cutil.padLeft(num.toString(), 3, '0');
}

export function containsDuplicate(str: string) {
    var list = str.split('');
    for (var i = 0, len = list.length; i < len; i++) {
        if (str.slice(0, i).concat(str.slice(i + 1)).indexOf(list[i]) >= 0)
            return true;
    }
    return false;
}
var memo = {};
export function getHint(str1: string, str2: string) {
    //if (containsDuplicate(str1) || containsDuplicate(str2))
    //    throw new Error('containing duplicate not support');
    if (memo[str1 + str2] != null) {
        return memo[str1 + str2];
    }
    var hit = 0;
    var blow = 0;
    for (var i = 0, iLen = str1.length; i < iLen; i++) {
        if (str1[i] === str2[i]) {
            hit++;
            continue;
        }
        for (var j = 0, jLen = str2.length; j < jLen; j++) {
            if (i === j)
                continue;
            if (str1[i] === str2[j]) {
                blow++;
            }
        }
    }
    memo[str1 + str2] = [hit, blow];
    return [hit, blow];
}
