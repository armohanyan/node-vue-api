const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log(err, "jwt verify error");
                res.redirect("/sign-up")
            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        res.redirect("/sign-up" );  
    }
}

module.exports = { requireAuth };
