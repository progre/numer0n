import util = require('./../service/util');

export = InferenceMachine;
class InferenceMachine {
    get() {
        // ‚ß‚ñ‚Ç‚­‚¹‚¦
        var num = Math.random() * 1000 | 0;
        if (num === 1000) {
            num = 0;
        }
        var str = util.to0PaddedString(num);
        if (!util.containsDuplicate(str))
            return str;
        return <string>this.get();
    }

    setHint(str: string, hits: number, blows: number) {
    }
}
