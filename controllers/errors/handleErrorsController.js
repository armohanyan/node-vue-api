class handleErrors {

    // return errors
    static handleErrors({errors}) {
        const filteredError = {}; 
        errors.forEach(error => {
            filteredError[error.param] = error.msg 
        });
        return filteredError;
    }
}

module.exports = handleErrors;