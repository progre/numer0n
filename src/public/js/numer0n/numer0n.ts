import util = require('./domain/service/util');

export = Numer0n;
class Numer0n {
    getRandomNumber() {
        var num = Math.random() * 1000 | 0;
        if (num === 1000) {
            num = 0;
        }
        return num;
    }

    start(playerNum: string, playerFirst: boolean) {
        this.validateStart(playerNum, playerFirst);
        alert('はじまｔｔ');
    }

    validateStart(playerNum: string, playerFirst: boolean) {
        var errors = [];
        if (playerNum == null || playerNum.length !== 3
            || /^[0-9]+$/.test(playerNum) || util.containsDuplicate(playerNum)) {
            errors.push('重複のない3桁の数字を入力してください');
        }
        if (errors.length > 0)
            throw new Error(errors.join('\n'));
    }
}