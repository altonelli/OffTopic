var postTemplate;
var $postList;




$(document).ready(function() {
  console.log('app.js loaded!');
  $postList = $('#postTarget');
  var postSource = $('#posts-template').html();
  postTemplate = Handlebars.compile(postSource);

  $.ajax({
    method: 'GET',
    url: '/api/posts',
    success: getAllPostSuccess,
    error: getAllPostError
  });


  $('#newPostForm').on('submit', function(e){
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/api/posts',
      data: $(this).serialize(),
      success: newPostSuccess,
      error: newPostError
    });
    $(this).val('');
  });

  $('#postTarget').on('click', '.like-button', function(e){
    e.preventDefault();
    var $post = $(this).closest('.post');
    var postId = $post.data('post-id');
    $.ajax({
      method: 'PUT',
      url: '/api/posts/' + postId,
      data: {
        text: $post.find('p').text(),
        likes: $(this).val()
      },
      success: likePostSuccess,
      error: likePostError
    });
  });



});

function likePostSuccess(post){
  var symbol = $('#postTarget').find('[data-post-id="' + post._id + '"]').find('.like-button').text();
  renderSinglePost(post);
  var $likeButton = $('#postTarget').find('[data-post-id="' + post._id + '"]').find('.like-button');
    if (symbol === "+"){
      $likeButton.text("-");
      $likeButton.val("-1");
    } else {
      $likeButton.text("+");
      $likeButton.val("1");
    }
}

function likePostError(err){
  console.log(err);
}

function getAllPostSuccess(posts){
  posts.forEach(renderPost);
}

function getAllPostError(err){
  console.log(err);
}

function newPostSuccess(post){
  renderPost(post);
}

function newPostError(err){
  console.log(err);
}

function renderSinglePost(post){
  var postHtml = postTemplate(post);
  // console.log(postHtml);
  // console.log($('#postTarget').find('[data-post-id="' + post._id + '"]').html());
  $('#postTarget').find('[data-post-id="' + post._id + '"]').html(postHtml);
}

function renderPost(post){
  var postHtml = postTemplate(post);
  $postList.prepend(postHtml);
}
