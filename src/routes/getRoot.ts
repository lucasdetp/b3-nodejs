
import { Application } from "express-ws";
import { findUserById, findPosts } from "../repositories/userRepository";


export function getRoot(app: Application) {
  app.get("/", async (req, res) => {
    const id = req.signedCookies.ssid;

    const user = await findUserById(id);
    if (!user) {
      res.clearCookie("ssid");
      res.redirect("/login");
      return;
    }

    const data = await findPosts();
    const posts = data.filter(post => post.content || post.image)
      .map((post) => {
        if (post.content) {
          return {
            content: post.content,
          };
        } else if (post.image) {
          return {
            image: post.image,
          };
        }
      });

    res.render("root", { posts });
  });
}
