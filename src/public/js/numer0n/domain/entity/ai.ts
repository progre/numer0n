import util = require('./../service/util');
import InferenceMachine = require('./inferencemachine');

export = AI;
class AI {
    private myNumber = '000';
    private inferenceMachine = new InferenceMachine();

    constructor(/** プレイヤーに予想させる数字 */num: number) {
        this.myNumber = util.to0PaddedString(num);
    }

    /** 相手の手を予想する */
    call() {
        return this.inferenceMachine.get();
    }

    setHint(num: number, hits: number, blows: number) {
        this.inferenceMachine.setHint(util.to0PaddedString(num), hits, blows);
    }

    /** ヒントを返す */
    getHint(num: number) {
        return getHint(this.myNumber, util.to0PaddedString(num));
    }
}


function getHint(str1: string, str2: string) {
    if (util.containsDuplicate(str1) || util.containsDuplicate(str2))
        throw new Error('containing duplicate not support');
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
    return [hit, blow];
}
