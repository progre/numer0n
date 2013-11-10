import cutil = require('./../../../common/util');
import util = require('./../service/util');
import Enumerable = require('linqjs');

export = InferenceMachine;
class InferenceMachine {
    private hints: Hint[] = [];
    private numbers = Enumerable.from(Enumerable.range(0, 1000)
        .select(x => util.to0PaddedString(x))
        .where((x: string) => !util.containsDuplicate(x))
        .toArray());
    private candidates: linqjs.IEnumerable<string>;

    constructor() {
        this.candidates = this.numbers;
    }

    get() {
        if (this.numbers === this.candidates ||
            this.candidates.count() <= 3)
            return this.candidates.shuffle().first();
        var list = compress(this.numbers
            .select(x => ({ str: x, score: this.calcScore(x) })))
        return list.where(x => x.score === list.max(x => x.score))
            .shuffle().first().str;
    }
    getAsync() {
        var promise = new cutil.Promise();
        setTimeout(() => promise.resolve(this.get()), 500);
        return promise;
    }

    setHint(str: string, hits: number, blows: number) {
        this.hints.push({ str: str, hits: hits, blows: blows });
        this.updateCandidates();
    }

    private updateCandidates() {
        this.candidates = compress(narrowDown(this.candidates, this.hints));
    }

    /** 指定のstrをコールした時に、絞り込まれる候補の期待値を返す */
    private calcScore(str: string) {
        var countAfter00 = 0;
        var countAfter01 = 0;
        var countAfter02 = 0;
        var countAfter03 = 0;
        var countAfter10 = 0;
        var countAfter11 = 0;
        var countAfter12 = 0;
        var countAfter20 = 0;
        var countAfter30 = 0;

        // コールの結果xxとなる候補の数をカウントする
        this.candidates.forEach(candidate => {
            var hint = util.getHint(str, candidate);
            if (hint[0] === 0 && hint[1] === 0) {
                countAfter00++;
            } else if (hint[0] === 0 && hint[1] === 1) {
                countAfter01++;
            } else if (hint[0] === 0 && hint[1] === 2) {
                countAfter02++;
            } else if (hint[0] === 0 && hint[1] === 3) {
                countAfter03++;
            } else if (hint[0] === 1 && hint[1] === 0) {
                countAfter10++;
            } else if (hint[0] === 1 && hint[1] === 1) {
                countAfter11++;
            } else if (hint[0] === 1 && hint[1] === 2) {
                countAfter12++;
            } else if (hint[0] === 2 && hint[1] === 0) {
                countAfter20++;
            } else if (hint[0] === 3 && hint[1] === 0) {
                countAfter30++;
            } else {
                throw new Error('invalid data');
            }
        });

        var countAll = countAfter00 + countAfter01 + countAfter02
            + countAfter03 + countAfter10 + countAfter11
            + countAfter12 + countAfter20 + countAfter30;

        // 返ってきたヒントで絞り込んだ結果の候補数
        var countHintIf00 = count(this.candidates, { str: str, hits: 0, blows: 0 });
        var countHintIf01 = count(this.candidates, { str: str, hits: 0, blows: 1 });
        var countHintIf02 = count(this.candidates, { str: str, hits: 0, blows: 2 });
        var countHintIf03 = count(this.candidates, { str: str, hits: 0, blows: 3 });
        var countHintIf10 = count(this.candidates, { str: str, hits: 1, blows: 0 });
        var countHintIf11 = count(this.candidates, { str: str, hits: 1, blows: 1 });
        var countHintIf12 = count(this.candidates, { str: str, hits: 1, blows: 2 });
        var countHintIf20 = count(this.candidates, { str: str, hits: 2, blows: 0 });
        var countHintIf30 = count(this.candidates, { str: str, hits: 3, blows: 0 });
        var allCountHint = countHintIf00 + countHintIf01 + countHintIf02
            + countHintIf03 + countHintIf10 + countHintIf11
            + countHintIf12 + countHintIf20 + countHintIf30;
        // 候補数の期待値
        return (allCountHint - countHintIf00) * (countAfter00 / countAll)
            + (allCountHint - countHintIf01) * (countAfter01 / countAll)
            + (allCountHint - countHintIf02) * (countAfter02 / countAll)
            + (allCountHint - countHintIf03) * (countAfter03 / countAll)
            + (allCountHint - countHintIf10) * (countAfter10 / countAll)
            + (allCountHint - countHintIf11) * (countAfter11 / countAll)
            + (allCountHint - countHintIf12) * (countAfter12 / countAll)
            + (allCountHint - countHintIf20) * (countAfter20 / countAll)
            + (allCountHint - countHintIf30) * (countAfter30 / countAll);
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

/** 絞り込む */
function narrowDown(numbers: linqjs.IEnumerable<string>, hintArray: Hint[]) {
    var hints = Enumerable.from(hintArray);
    return numbers
        .where((x: string) =>
            hints.select(y => ({
                target: util.getHint(x, y.str),
                expect: [y.hits, y.blows]
            }))
                .all(y => equalsHint(y.target, y.expect)));
}

function count(numbers: linqjs.IEnumerable<string>, hint: Hint) {
    return numbers
        .count(x => equalsHint(util.getHint(x, hint.str), [hint.hits, hint.blows]));
}

function compress<T>(enumerable: linqjs.IEnumerable<T>): linqjs.IEnumerable<T> {
    return Enumerable.from(enumerable.toArray());
}
