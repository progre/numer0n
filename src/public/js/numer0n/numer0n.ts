import util = require('./domain/service/util');
import AI = require('./domain/entity/ai');

export = Numer0n;
class Numer0n {
    private state = State.INACTIVE;
    private playerNumber = '';
    private ai: AI;
    playerAttacks = [];
    aiAttacks = [];
    info = '';
    lastPlayerAttack = '';
    playerMessage = '';
    lastAIAttack = '';
    aiMessage = '';

    constructor() {
        this.ai = new AI(getRandomNumber());
    }

    getAINumber() {
        return this.ai.myNumber;
    }

    start(playerNumber: string, playerFirst = true) {
        if (!isNumer0nString(playerNumber))
            throw new Error('重複のない3桁の数字を入力してください');
        this.playerNumber = playerNumber;
        if (playerFirst) {
            this.state = State.PRE_ATTACK_AI;
        } else {
            this.state = State.PRE_ATTACK_PLAYER;
        }
    }

    put(call: string) {
        if (!isNumer0nString(call)) {
            throw new Error('重複のない3桁の数字を入力してください');
        }
        this.lastPlayerAttack = call;
        this.state = State.READY;
    }

    next() {
        switch (this.state) {
            case State.READY:
                this.lastAIAttack = '';
                this.aiMessage = '';
                this.playerMessage = this.lastPlayerAttack;
                this.info = 'あなたの攻撃です';
                this.state = State.ATTACK_AI;
                return 500;
            case State.ATTACK_AI:
                var hint = this.ai.getHint(this.lastPlayerAttack);
                if (hint[0] === 3) {
                    this.aiMessage = '参りました';
                    this.info = 'あなたの勝ちです';
                    return -2;
                }
                this.aiMessage = hintToString(hint);
                this.playerAttacks.push({
                    idx: this.playerAttacks.length,
                    item: toString(this.lastPlayerAttack, hint)
                });
                console.log(this.playerAttacks.length);
                this.state = State.PRE_ATTACK_PLAYER;
                return 1000;
            case State.PRE_ATTACK_PLAYER:
                this.lastPlayerAttack = '';
                this.playerMessage = '';
                this.lastAIAttack = this.ai.call();
                this.aiMessage = this.lastAIAttack;
                this.info = 'ぬめぐれの攻撃です';
                this.state = State.ATTACK_PLAYER;
                return 500;
            case State.ATTACK_PLAYER:
                var hint = util.getHint(this.playerNumber, this.lastAIAttack);
                if (hint[0] === 3) {
                    this.playerMessage = '';
                    this.info = 'あなたの負けです';
                    return -2;
                }
                this.playerMessage = hintToString(hint);
                this.aiAttacks.push({
                    idx: this.aiAttacks.length,
                    item: toString(this.lastAIAttack, hint)
                });
                this.ai.putHint(this.lastAIAttack, hint[0], hint[1]);
                this.state = State.PRE_ATTACK_AI;
                return 1000;
            case State.PRE_ATTACK_AI:
                this.info = 'あなたの番です。コールしてください。';
                return -1;
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
    PRE_ATTACK_PLAYER,
    ATTACK_PLAYER,
    PRE_ATTACK_AI
}
