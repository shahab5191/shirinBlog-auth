class SBError extends Error {
  constructor (public errorType: string, public param: any) {
    super(errorType)
    Object.setPrototypeOf(this, SBError.prototype)
  }
}

export default SBError
