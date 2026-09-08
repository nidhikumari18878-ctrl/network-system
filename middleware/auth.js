
// ================================
// Authentication Middleware
// ================================

const requireLogin = (req, res, next) => {
    // User session check
    if (!req.session || !req.session.user) {
        return res.redirect("/login");
    }

    next();
};


// ================================
// Role-Based Authorization
// ================================

const requireRole = (role) => {
    return (req, res, next) => {

        // First check authentication
        if (!req.session || !req.session.user) {
            return res.redirect("/login");
        }

        // Check whether requested role matches
        if (req.session.user.role !== role) {
            return res.status(403).send("403 - Access Denied");
        }

        next();
    };
};


// ================================
// Multiple Role Authorization
// ================================

const requireAnyRole = (...roles) => {
    return (req, res, next) => {

        // Authentication check
        if (!req.session || !req.session.user) {
            return res.redirect("/login");
        }

        // Authorization check
        if (!roles.includes(req.session.user.role)) {
            return res.status(403).send("403 - Access Denied");
        }

        next();
    };
};


// ================================
// Export
// ================================

module.exports = {
    requireLogin,
    requireRole,
    requireAnyRole
};

