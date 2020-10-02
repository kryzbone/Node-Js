

exports.get_items = (req, res, next) => {
    res.send("<h1> All items")
}

exports.single_item = (req, res, next) => {
    res.send("<h1> Single items")
}

exports.create_item_get = (req, res, next) => {
    res.send("<h1> Create item form")
}

exports.create_item_post = (req, res, next) => {
    res.send("<h1> redirect after item created succesful")
}

exports.update_item_get = (req, res, next) => {
    res.send("<h1> Update items")
}

exports.update_item_post = (req, res, next) => {
    res.send("<h1>Redirect Update item succes")
}

exports.delete_item_get = (req, res, next) => {
    res.send("<h1> Delete items")
}

exports.delete_item_post = (req, res, next) => {
    res.send("<h1>redirect succes Delete item")
}