const compare = function compare(password, hashedPassword) {
    // Cannot bcrypt compare when one is undefined
    if (!password || !hashedPassword) {
        return Promise.resolve(false);
    }

    return bcrypt.compare(password, hashedPassword);
}

module.export = compare