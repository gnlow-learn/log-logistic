const bisectionSearch = (
    f: (b: number) => number, 
    low: number, 
    high: number, 
    tolerance = 1e-7, 
    maxIterations = 100,
) => {
    while (f(high) > 0 && high < 10000) {
        high *= 2
    }

    let beta = (low+high)/2

    for (let i=0; i<maxIterations; i++) {
        const val = f(beta)
        
        if (Math.abs(val) < tolerance) break

        if (val > 0) {
            high = beta
        } else {
            low = beta
        }
        beta = (low+high)/2
    }

    return beta
}

const getParams =
(peak: number, mean: number) => {
    if (peak>=mean || peak<=0 || mean<=0) {
        throw new Error("range err")
    }

    const targetRatio = peak/mean
    
    const f = (b: number) => {
        const t1 = Math.pow((b-1)/(b+1), 1/b)
        const t2 = Math.PI/b/Math.sin(Math.PI/b)
        return t1/t2-targetRatio
    }

    const b = bisectionSearch(f, 1.0001, 100.0)
    const a = peak / Math.pow((b-1) / (b+1), 1/b)

    return { a, b }
}

export class LogLogistic {
    constructor(
        public a: number,
        public b: number,
    ) {}
    cdf(x: number) {
        const t = Math.pow(x/this.a, this.b)
        return t/(1+t)
    }
    static fromPeakMean(
        peak: number,
        mean: number,
    ) {
        const { a, b } = getParams(peak, mean)
        return new LogLogistic(a, b)
    }
}
