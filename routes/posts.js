const router = require('koa-router')();

router.prefix('/posts');

const posts = [{'id':0,'created_at':'2017-01-01','title':'this is 1'},
{'id':1,'created_at':'2017-01-01','title':'this is 2'},
{'id':2,'created_at':'2017-02-01','title':'this is 3'},
{'id':3,'created_at':'2017-03-01','title':'this is 4'},
{'id':4,'created_at':'2017-04-01','title':'this is 5'}];

/**
 * Post listing.
 */

async function list(ctx) {
    await ctx.render('posts/list', { posts: posts });
}

/**
 * Show creation form.
 */

async function add(ctx) {
    await ctx.render('posts/new');
}

/**
 * Show post :id.
 */

async function show(ctx) {
    const id = ctx.params.id;
    const post = posts[id];
    if (!post) ctx.throw(404, 'invalid post id');
    await ctx.render('posts/show', { post: post });
}

/**
 * Create a post.
 */

async function create(ctx) {
    const post = ctx.request.body;
    const id = posts.push(post) - 1;
    post.created_at = new Date();
    post.id = id;
    ctx.redirect('./list');
}


router.get('/list', list)
  .get('/new', add)
  .get('/:id', show)
  .post('/create', create);

module.exports = router