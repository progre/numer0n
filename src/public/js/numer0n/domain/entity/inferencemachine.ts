import util = require('./../service/util');
import Enumerable = require('linqjs');

export = InferenceMachine;
class InferenceMachine {
    private hints: Hint[] = [];

    get() {
        return this.candidate().shuffle().first();
    }

    setHint(str: string, hits: number, blows: number) {
        this.hints.push({ str: str, hits: hits, blows: blows });
    }

    private candidate() {
        var hints = Enumerable.from(this.hints);
        return Enumerable.range(0, 1000)
            .select(x => util.to0PaddedString(x))
            .where((x: string) => !util.containsDuplicate(x))
            .where((x: string) =>
                hints.select(y => ({
                    target: util.getHint(x, y.str),
                    expect: [y.hits, y.blows]
                }))
                    .all(y => equalsHint(y.target, y.expect)));
    }
}

interface Hint {
    str: string;
    hits: number;
    blows: number;
}

function equalsHint(array1: any[], array2: any[]) {
    return array1[0] === array2[0] && array1[1] === array2[1]
}