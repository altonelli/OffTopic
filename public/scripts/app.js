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

  $('#postTarget').on('click', '.like-post-button', function(e){
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

  $('#postTarget').on('click', '.delete-post-button', function(e){
    e.preventDefault();
    var $post = $(this).closest('.post');
    var postId = $post.data('post-id');
    $.ajax({
      method: 'DELETE',
      url: '/api/posts/' + postId,
      success: deletePostSuccess,
      error: deletePostError
    });
  });

  $('#postTarget').on('click', '.edit-post-button', function(e){
    e.preventDefault();
    var $post = $(this).closest('.post');
    var postId = $post.data('post-id');
    $(this).toggleClass('hidden');
    $post.find('.update-post-button').toggleClass('hidden');
    $post.find('.edit-post-form').toggleClass('hidden');
    $post.find('p').toggleClass('hidden');
  });

  $('#postTarget').on('click', '.update-post-button', function(e){
    e.preventDefault();
    var $post = $(this).closest('.post');
    var postId = $post.data('post-id');
    $.ajax({
      method: 'PUT',
      url: '/api/posts/' + postId,
      data: {
        text: $post.find('.edit-post-form').val(),
        likes: 0
      },
      success: updatePostSuccess,
      error: updatePostError
    });
  });


});

function updatePostSuccess(post){
  var symbol = $('#postTarget').find('[data-post-id="' + post._id + '"]').find('.like-post-button').text();
  renderSinglePost(post);
  var $likeButton = $('#postTarget').find('[data-post-id="' + post._id + '"]').find('.like-post-button');
    if (symbol === "+"){
      $likeButton.text("+");
      $likeButton.val("1");
    } else {
      $likeButton.text("-");
      $likeButton.val("-1");
    }
}

function updatePostError(err){
  console.log(err);
}

function deletePostSuccess(post){
  $('#postTarget').find('[data-post-id="' + post._id + '"]').remove();
}

function deletePostError(err){
  console.log(err);
}

function likePostSuccess(post){
  var symbol = $('#postTarget').find('[data-post-id="' + post._id + '"]').find('.like-post-button').text();
  renderSinglePost(post);
  var $likeButton = $('#postTarget').find('[data-post-id="' + post._id + '"]').find('.like-post-button');
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
