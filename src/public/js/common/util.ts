/** ����totalWidth�ɂȂ�܂�str�̍�����paddingChar���l�߂� */
export function padLeft(str: string, totalWidth: number, paddingChar: string) {
    var padStr = str;
    while (padStr.length < totalWidth) {
        padStr = paddingChar + padStr;
    }
    return padStr.substring(0, totalWidth);
}

/** ����totalWidth�ɂȂ�܂�str�̉E����paddingChar���l�߂� */
export function padRight(str: string, totalWidth: number, paddingChar: string) {
    var padStr = str;
    while (padStr.length < totalWidth) {
        padStr += paddingChar;
    }
    return padStr.substring(0, totalWidth);
}

export class Promise {
    private callback: Function;

    then(callback: Function) {
        this.callback = callback;
    }

    resolve(obj: any) {
        if (this.callback == null) {
            setTimeout(() => this.resolve(obj), 0.001);
            return this;
        }
        this.callback(obj);
        return this;
    }
}
