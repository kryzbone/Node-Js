


exports.get_categories = (req, res, next) => {
    res.send("<h1> All Categories");
}

exports.single_category = (req, res, next) => {
    res.send("<h1> category detials")
}

exports.create_category_get = (req, res, next) => {
    res.send("<h1> create get")
}

exports.create_category_post = (req, res, next) => {
    res.send("create post")
}


exports.delete_category_get = (req, res, next) => {
    res.send("<h1> delete category get")
}

exports.delete_category_post = (req, res, next) => {
    res.send("<h1> delete category Posyt")
}

exports.update_category_get = (req, res, next) => {
    res.send("<h1> Update category get ")
}

exports.update_category_post = (req, res, next) => {
    res.send("<h1> Update category post ")
}

