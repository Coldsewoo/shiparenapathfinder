
Number.prototype.ROUNDUP = function (i) {
    let demical = Math.pow(10, i)
    let num = this.valueOf() * demical;
    if (num < 0) num = Math.floor(num);
    else num = Math.ceil(num)
    return num / demical;
}

Number.prototype.ROUNDDOWN = function (i) {
    let demical = Math.pow(10, i)
    let num = this.valueOf() * demical;
    if (num < 0) num = Math.ceil(num);
    else num = Math.floor(num)
    return Math.floor(num) / demical;
}

Number.prototype.ROUND = function (i) {
    let demical = Math.pow(10, i)
    let num = this.valueOf() * demical;
    return Math.round(num) / demical;
}
