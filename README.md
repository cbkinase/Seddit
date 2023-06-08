# Seddit

## Intro

Seddit is a reddit clone, complete with subreddits, posts, comments, and voting. <a href="https://cameron-seddit.onrender.com/">Come check it out!</a>

Future functionality includes
- A rich text editor for posts and comments
- The ability to upload your own post attachments via AWS
- Different post attachment types (such as links or short videos), not just images
- The ability to follow, be followed by, and direct message other users.

## Challenges

One of the biggest technical hurdles to completing this project was the management of nested comments. To tackle this challenge on the database level, I used the adjacency list pattern, allowing me to represent hierarchical data in a 'flat' table.

But this was far from the only challenge associated with nesting comments. Once I had the database set up, I had to figure out the most effective way of getting that information out of the database, representing it as JSON, and sending it through my API. Though I likely did not figure out the "most effective way", I did figure out something that worked with some degree of success. My solution to this was, perhaps unsurprisingly, to make extensive use of recursion. Let's work backwards from the API route to understand how it works.

The following is the route for getting all of the comments of a post:

```py
@post_routes.route("/<int:post_id>/comments")
def get_all_post_comments(post_id):
    post = Post.query.get(post_id)

    if not post:
        return {"errors": ["Post not found"]}, 404

    return {"Comments": {comment.id: comment.to_short_dict() for comment in post.comments if comment.parent_id == None}}
```

All you really need to know about the model to make sense of this is that parent_id refers to the parent ID of a comment -- that is, if a comment is a top-level comment, it will have a parent_id of NULL (None), and if it is a nested comment, that parent_id will be some integer value. In this way, we retrieve all of the top-level comments of a post. Within the `comment.to_short_dict()` method, I get all of the nested replies using by defining a `replies` key like so:

` 'replies': {reply.id: reply.to_mega_short_dict(depth+1) for reply in self.children} if len(self.children) else None, `

This, ultimately, yields a structure of comments that is organized in the following way:
```
Comments: 
 {comment_id}: {
  author_info: {...},
  content: "",
  created_at: "",
  depth: "",
  id: "",
  num_replies: "",
  parent_id: "",
  post_id: "",
  reaction_info: {...},
  replies: {
    {reply_id}: {...},
  }
  updated_at: "",
  upvotes: 5,
 },
 {comment_id_2}: {...},
 {...},
```

Resulting in a nice, easy to work with tree-like structure. But the battle was far from over, even at this point. How can I deal with showing them on the page properly now?

Well... more recursion. We can imagine that, given the comments structure above, it's rather easy to render top-level comments. Just iterate over the values in comments, placing/styling each element as needed. It turns out that if you can render a single (top-level) comment, you only need to add a single line of code to render the rest of the replies. But to do this, you need to create a React component that calls itself:

```js
/* 
[within SingleComment.js]
...
*/
{comment.num_replies
    ? <div>
      {Object.values(comment.replies).sort(sortingFunction).map(reply =>
        <SingleComment
          key={reply.id}
          comment={reply}
          user={user}
          post={post}
          sortingFunction={sortingFunction}
          />)}
    </div>
: null}
```

And... voila. I also used the depth information to adjust the spacing as needed, providing a visual representation of nesting:

```js
function setDivWidth() {
        if (window.visualViewport.width > 700) {
            return `${600 - comment.depth * 23}px`
        }
        else {
            return `${"100%" - comment.depth * 23}px`
        }
    }
 ```

Overall, it was an extremely fun and interesting problem to solve, and I was excited to make use of my first 'recursive component'.

## Technologies used

- Backend: Flask, SQLAlchemy, PostgreSQL
- Frontend: React, Redux


## Demo

### Landing page (all posts)
<img src="https://i.gyazo.com/c287c2bf4f6f64851d9b82a578fc6a68.png">

### Explore communities page
<img src="https://i.gyazo.com/87f3defce03bb7c5a01ed62947da793a.png">

### Comments on posts
<img src="https://i.gyazo.com/edb4fc7b1beb018f6f6d5816e12dd7a4.png">

### User profile page
<img src="https://i.gyazo.com/00819d653aa4b05f1e111fc05acb0608.png">

## How to Use Locally

1. Install dependencies by running `pipenv install -r requirements.txt`
2. Configure a `.env` file according to `.env.example`
3. Migrate and seed your database and start the backend server by running ```pipenv shell && flask db upgrade && flask seed all && flask run```
4. In the `frontend` directory, run ```npm i && npm start```
5. Your front and back ends will now both be accessible.
