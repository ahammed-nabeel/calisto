# How to Add a New Blog Post

The blog system has been updated to support separate pages for each post and a dynamic list on the main blog page.

## Steps to Add a Post

1.  **Create the Post File**
    - Go to the `posts/` directory.
    - Copy an existing file (e.g., `smart-automation.html`) and rename it (e.g., `new-post.html`).
    - Open the new file and update:
        - `<title>` tag.
        - `<meta name="description">` content.
        - The `<h1>` title inside `.post-content`.
        - The Date in `.post-meta`.
        - The Image `src` and `alt` text.
        - The content text inside `.post-body`.

2.  **Update the List**
    - Open `js/blog-data.js`.
    - Add a new entry to the `blogPosts` array at the top (so it appears first):

    ```javascript
    {
        id: "unique-id",
        title: "Your New Post Title",
        date: "Month Day, Year",
        image: "URL_TO_IMAGE",
        summary: "A short summary of the post that appears on the main list...",
        link: "posts/new-post.html"
    },
    ```

3.  **Done!**
    - Refresh `blog.html`. The new post will automatically appear in the list.
    - Clicking the post will take you to your new page.
