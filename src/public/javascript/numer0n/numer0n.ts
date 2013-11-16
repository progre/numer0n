import cutil = require('./../common/util');
import util = require('./domain/service/util');
import AI = require('./domain/entity/ai');

export = Numer0n;
class Numer0n {
    private state = State.INACTIVE;
    private playerNumber = '';
    private ai: AI;
    private name = '';
    playerAttacks = [];
    aiAttacks = [];
    info = '';
    lastPlayerAttack = '';
    playerMessage = '';
    lastAIAttack = '';
    aiMessage = '';
    playerFirst = true;
    reach = false;

    constructor() {
        this.ai = new AI(getRandomNumber());
    }

    getAINumber() {
        return this.ai.myNumber;
    }

    start(name: string, playerNumber: string, playerFirst = true) {
        this.name = name;
        this.playerFirst = playerFirst;
        if (playerNumber === 'tst') {
            benchmark();
            throw new Error();
        }
        if (!isNumer0nString(playerNumber))
            throw new Error('重複のない3桁の数字を入力してください');
        this.playerNumber = playerNumber;
        if (playerFirst) {
            this.state = State.PRE_ATTACK_AI;
        } else {
            this.state = State.INFERENCE_WAIT;
        }
    }

    put(call: string) {
        if (!isNumer0nString(call)) {
            throw new Error('重複のない3桁の数字を入力してください');
        }
        this.lastPlayerAttack = call;
        this.state = State.READY;
    }

    nextAsync() {
        var promise = new cutil.Promise()
        switch (this.state) {
            case State.READY:
                this.lastAIAttack = '';
                this.aiMessage = '';
                this.playerMessage = this.lastPlayerAttack;
                this.info = this.name + 'の攻撃です';
                this.state = State.ATTACK_AI;
                return promise.resolve(500);
            case State.ATTACK_AI:
                var hint = this.ai.getHint(this.lastPlayerAttack);
                this.aiMessage = hintToString(hint);
                var count = this.ai.countCandidates();
                if (this.playerFirst) {
                    if (hint[0] === 3) {
                        this.aiMessage += '。なん…だと…';
                        this.info = 'リーチです';
                        this.reach = true;
                    } else if (count === 1) {
                        this.aiMessage += '。テーレッテー';
                    }
                } else {
                    if (this.reach) {
                        if (hint[0] === 3) {
                            this.aiMessage = 'やりよるね。';
                            this.info = '引き分けです';
                            return promise.resolve(-2);
                        } else {
                            this.aiMessage = hintToString(hint) + '。 雑魚乙ぅ！';
                            this.info = 'ぬめぐれの勝ちです';
                            return promise.resolve(-2);
                        }
                    }
                    if (hint[0] === 3) {
                        if (count > 50) {
                            this.aiMessage = 'あークソゲあー売ろう';
                        } else {
                            this.aiMessage = '参りました';
                        }
                        this.info = this.name + 'の勝ちです';
                        return promise.resolve(-2);
                    }
                }
                this.playerAttacks.push({
                    idx: this.playerAttacks.length,
                    item: toString(this.lastPlayerAttack, hint)
                });
                this.state = State.INFERENCE_WAIT;
                return promise.resolve(1);
            case State.INFERENCE_WAIT:
                // 先に計算しとく
                this.ai.processAsync().then(() => {
                    this.info = 'ボタンを押してください';
                    this.state = State.PRE_ATTACK_PLAYER;
                    promise.resolve(-3);
                });
                this.info = 'ぬめぐれが考えています…';
                return promise;
            case State.PRE_ATTACK_PLAYER:
                this.lastAIAttack = this.ai.call();
                this.lastPlayerAttack = '';
                this.playerMessage = '';
                var count = this.ai.countCandidates();
                if (count === 1) {
                    if (this.reach) {
                        this.aiMessage = this.lastAIAttack + '。切り返してゆくぅ';
                    } else {
                        this.aiMessage = this.lastAIAttack + '。雑魚乙ぅ！';
                    }
                } else if (count < 3) {
                    this.aiMessage = 'あたれー ' + this.lastAIAttack;
                } else if (count < 16) {
                    this.aiMessage = this.lastAIAttack + '。そろそろボコすんでー';
                } else {
                    this.aiMessage = this.lastAIAttack;
                }
                this.info = 'ぬめぐれの攻撃です';
                this.state = State.ATTACK_PLAYER;
                return promise.resolve(500);
            case State.ATTACK_PLAYER:
                var hint = util.getHint(this.playerNumber, this.lastAIAttack);
                this.playerMessage = hintToString(hint);
                if (this.playerFirst) {
                    if (this.reach) {
                        if (hint[0] === 3) {
                            this.info = '引き分けです';
                            return promise.resolve(-2);
                        } else {
                            this.info = this.name + 'の勝ちです';
                            return promise.resolve(-2);
                        }
                    }
                    if (hint[0] === 3) {
                        this.info = 'ぬめぐれの勝ちです';
                        var count = this.ai.countCandidates();
                        if (count === 1) {
                        } else if (count < 8) {
                            this.aiMessage = '雑魚乙ぅ';
                        } else if (count < 16) {
                            this.aiMessage = '大勝利！';
                        } else if (count < 32) {
                            this.aiMessage = 'はー神ゲー';
                        } else {
                            this.aiMessage = 'えっ';
                        }
                        return promise.resolve(-2);
                    }
                } else {
                    if (hint[0] === 3) {
                        this.info = 'リーチです';
                        this.reach = true;
                    }
                }
                this.aiAttacks.push({
                    idx: this.aiAttacks.length,
                    item: toString(this.lastAIAttack, hint)
                });
                this.ai.putHint(this.lastAIAttack, hint[0], hint[1]);
                this.state = State.PRE_ATTACK_AI;
                return promise.resolve(10);
            case State.PRE_ATTACK_AI:
                this.info = this.name + 'の番です。コールしてください。';
                return promise.resolve(-1);
        }
    }
}

function isNumer0nString(str: string) {
    return str != null && str.length === 3
        && /^[0-9]+$/.test(str) && !util.containsDuplicate(str);
}

function toString(call: string, hint: number[]) {
    return call + ' → ' + hintToString(hint);
}

function hintToString(hint: number[]) {
    return hint[0] + ' eat' + (hint[0] >= 2 ? 's' : '')
        + ', ' + hint[1] + ' bite' + (hint[1] >= 2 ? 's' : '');
}

function getRandomNumber() {
    var num = Math.random() * 1000 | 0;
    if (num === 1000) {
        num = 0;
    }
    var str = util.to0PaddedString(num);
    if (!util.containsDuplicate(str))
        return str;
    return <string>getRandomNumber();
}

enum State {
    INACTIVE,
    READY,
    ATTACK_AI,
    INFERENCE_WAIT,
    PRE_ATTACK_PLAYER,
    ATTACK_PLAYER,
    PRE_ATTACK_AI
}

function benchmark() {
    benchmarkOneCycleAsync(0, 0).then(x => {
        console.log(x / 10);
    });
}

function benchmarkOneCycleAsync(count: number, sum: number): cutil.Promise {
    var MAX = 10;
    var promise = new cutil.Promise();
    var ai = new AI('012');
    processAsync(ai, 1).then(x => {
        count++;
        sum += x;
        if (count >= MAX) {
            return promise.resolve(sum);
        }
        benchmarkOneCycleAsync(count, sum).then(x => promise.resolve(x));
    });
    return promise;
}

function processAsync(ai: AI, count: number): cutil.Promise {
    var promise = new cutil.Promise();
    ai.processAsync().then(() => {
        var call = ai.call();
        var hint = util.getHint('012', call);
        if (hint[0] === 3) {
            promise.resolve(count);
            return;
        }
        ai.putHint(call, hint[0], hint[1]);
        processAsync(ai, count + 1).then(x => promise.resolve(x));
    });
    return promise;
}