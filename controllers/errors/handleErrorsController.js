class handleErrors {

    // return errors
    static handleErrors (err) {
        let errors = {};

        // duplicate error code 
        if (err.code === 11000) {
            errors.email =  "The user is already exist!"
        } 
        // validation errors
        else {
            Object.values(err.errors).forEach(( { properties } )=> {
                errors[properties.path] = properties.message;
            }) 
        }   

        return errors;
    }
}

module.exports = handleErrors;