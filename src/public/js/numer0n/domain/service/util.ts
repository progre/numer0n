import cutil = require('./../../../common/util');

export function to0PaddedString(num: number) {
    return cutil.padLeft(num.toString(), 3, '0');
}

export function containsDuplicate(str: string) {
    var list = str.split('');
    for (var i = 0, len = list.length; i < len; i++) {
        if (str.indexOf(list[i]) >= 2)
            return true;
    }
    return false;
}
