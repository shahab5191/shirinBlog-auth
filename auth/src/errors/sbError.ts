class sbError extends Error {
    constructor(public errorType: string, public message: any){
        super(message);
        Object.setPrototypeOf(this, sbError.prototype);
    }
}

export default sbError