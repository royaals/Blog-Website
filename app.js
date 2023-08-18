//jshint esversion:6
const mongoose = require("mongoose");
var _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3000;

const uri = process.env.DATABASE;

mongoose.connect(uri);
const BlogSchema = mongoose.Schema({
  title: String,
  content: String,
});
const BlogPosts = mongoose.model("posts", BlogSchema);

const homeStartingContent =
  "Discover, Learn, Inspire. Welcome to Daily Journal. We're your gateway to a world of captivating stories, expert insights, and fresh perspectives. Our passion drives us to curate thought-provoking content across a spectrum of topics, from travel and tech to lifestyle and beyond. Join us on this journey as we unravel the extraordinary in the ordinary, and ignite your curiosity. Unleash your potential with Daily Journal — where knowledge meets inspiration.";
const aboutContent =
  "Welcome to our blog! At Daily Journal, we are passionate about sharing valuable insights, tips, and stories that inspire and inform our readers. Our team of dedicated writers brings a diverse range of expertise to cover various topics, from technology and travel to lifestyle and personal development. Our goal is to create a platform where you can discover new ideas, gain practical knowledge, and engage in meaningful conversations. Whether you're a seasoned enthusiast or a curious beginner, we're here to accompany you on your journey of exploration and learning. Thank you for being a part of our community, and we can't wait to embark on this exciting blogging adventure together!";
const contactContent =
  "Got questions, ideas, or just want to chat? We'd love to hear from you! Reach out to us at royalbvr50@gmail.com for inquiries, suggestions, or collaborations. Your feedback fuels our passion for delivering content that matters to you. Let's connect and embark on meaningful conversations together.";

app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let posts = [];

app.get("/", async (req, res) => {
  try {
    const fetchedPosts = await BlogPosts.find();
    const posts = []; // Clear the posts array for each request

    fetchedPosts.forEach((data) => {
      const post = {
        title: data.title,
        content: data.content,
      };
      posts.push(post);
    });

    res.render("home.ejs", {
      homeStartCont: homeStartingContent,
      postCompose: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.render("home.ejs", {
      homeStartCont: homeStartingContent,
      postCompose: [],
    });
  }
});
app.get("/about", (req, res) => {
  res.render("about.ejs", {
    aboutCont: aboutContent,
  });
});
app.get("/contact", (req, res) => {
  res.render("contact.ejs", {
    contactCont: contactContent,
  });
});

app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});
app.get("/posts/:post", async (req, res) => {
  const postTitle = req.params.post;

  try {
    const post = await BlogPosts.findOne({ title: postTitle });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.render("post.ejs", {
      postT: post.title,
      postC: post.content,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/compose", async (req, res) => {
  const post = {
    title: req.body.postTitle,
    content: req.body.postContent,
  };
  await BlogPosts.create(post);
  res.redirect("/");
});
app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
