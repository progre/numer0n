/** •‚ªtotalWidth‚É‚È‚é‚Ü‚Åstr‚Ì¶‘¤‚ÉpaddingChar‚ğ‹l‚ß‚é */
export function padLeft(str: string, totalWidth: number, paddingChar: string) {
    var padStr = str;
    while (padStr.length < totalWidth) {
        padStr = paddingChar + padStr;
    }
    return padStr.substring(0, totalWidth);
}

/** •‚ªtotalWidth‚É‚È‚é‚Ü‚Åstr‚Ì‰E‘¤‚ÉpaddingChar‚ğ‹l‚ß‚é */
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
