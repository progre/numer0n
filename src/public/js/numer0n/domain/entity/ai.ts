import util = require('./../service/util');
import InferenceMachine = require('./inferencemachine');

export = AI;
class AI {
    myNumber = '000';
    private inferenceMachine = new InferenceMachine();

    constructor(/** プレイヤーに予想させる数字 */num: string) {
        this.myNumber = num;
    }

    /** 相手の手を予想する */
    call() {
        return this.inferenceMachine.get();
    }

    putHint(num: string, hits: number, blows: number) {
        this.inferenceMachine.setHint(num, hits, blows);
    }

    /** ヒントを返す */
    getHint(num: string) {
        return util.getHint(this.myNumber, num);
    }
}
