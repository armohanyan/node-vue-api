class handleErrors {

    // return errors
    static handleErrors(err) {
        let errors = {};

        // Incorrect email
        if (err.message === "Incorrect email") {
            errors.email = "The email is not registered"
        }   
        // Incorrect user password
        if (err.message === "Incorrect password") {
            errors.password = "The password is incorrect";
        }

        // Duplicate error code 
        if (err.code === 11000) {
            errors.email = "The user is already exist!"
        }

        // Validation errors
        if (err.message.includes('user validation failed')) {
            Object.values(err.errors).forEach(({ properties }) => {
                errors[properties.path] = properties.message;
            });
        }

        return errors;
    }
}

module.exports = handleErrors;