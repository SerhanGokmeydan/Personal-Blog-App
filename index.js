import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const port = 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const blogs = [];

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

function Blog(title, content) {
    this.title = title;
    this.content = content;

    return this;
}

const getBlog = (req, res, next) => {
    const id = req.params.id;
    const blog = blogs.find((blog) => blog.id == id);
    req.blog = blog;
    next();
};

app.get("/", (req, res) => {
    res.render(__dirname + "/views/list-of-blogs.ejs", {
        blogs: blogs,
    });
});

app.get("/create", (req, res) => {
    res.render(__dirname + "/views/create-blog.ejs");
});

app.get("/edit/:id", getBlog, (req, res) => {
    if (req.blog) {
        req.blog.content = req.blog.content;
        res.render(__dirname + "/views/edit-blog.ejs", {
            blog: req.blog,
        });
    } else {
        res.send("Blog not found");
    }
});

app.get("/blog/:id", getBlog, (req, res) => {
    if (req.blog) {
        res.render(__dirname + "/views/content-of-blog.ejs", {
            blog: req.blog,
            currentUrl: req.url,
        });
    } else {
        res.send("Blog not found");
    }
});

app.post("/create", (req, res) => {
    const title =
        req.body.title.charAt(0).toUpperCase() + req.body.title.slice(1);
    const content = req.body.content;
    if (title && content) {
        const blog = new Blog(title, content);
        blog.id = blogs.length + 1;
        blogs.push(blog);
    }
    res.redirect("/");
});

app.post("/edit/:id", getBlog, (req, res) => {
    const content = req.body.content;
    const action = req.body.action;

    if (!req.blog) {
        res.send("Blog not found");
    }

    if (content && action === "edit") {
        req.blog.content = content;
        res.redirect(`/blog/${req.blog.id}`);
    } else if (action === "delete") {
        const index = blogs.indexOf(req.blog);
        if (index > -1) {
            blogs.splice(index, 1);
        }
        res.redirect("/");
    }
});

app.listen(port, () => {
    console.log(`server has created on port ${port}`);
});
