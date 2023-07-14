class sbError extends Error {
    constructor(public errorType: string, public param: any){
        super(errorType);
        Object.setPrototypeOf(this, sbError.prototype);
    }
}

export default sbError