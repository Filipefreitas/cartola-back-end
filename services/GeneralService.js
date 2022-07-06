exports.home = (req, res)=> {
    res.json({
        message: "Home page"
    })
}

exports.notFound = (req, res)=> {
    res.status(404).json({
        message: "404 Page not found"
    })
};