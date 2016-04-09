var postTemplate;
var $postList;
var commentTemplate;
var foundUserTemplate;
var $foundUserList;





$(document).ready(function() {
  console.log('app.js loaded!');
  $postList = $('#postTarget');
  $foundUserList = $('.found-user-modal-body');
  var postSource = $('#posts-template').html();
  postTemplate = Handlebars.compile(postSource);
  var commentSource = $('#comment-template').html();
  commentTemplate = Handlebars.compile(commentSource);
  var foundUserSource = $('#found-user-template').html();
  foundUserTemplate = Handlebars.compile(foundUserSource);


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
    console.log(e);
    e.preventDefault();
    var $post = $(this).closest('.post');
    var postId = $post.data('post-id');
    $.ajax({
      method: 'PUT',
      url: '/api/posts/' + postId,
      data: {
        text: $post.find('.edit-post-form').val(),
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
    console.log("edit",event);
    e.preventDefault();
    var $post = $(this).closest('.post');
    var postId = $post.data('post-id');
    $(this).toggleClass('hidden');
    $post.find('.update-post-button').toggleClass('hidden');
    $post.find('.edit-post-form').toggleClass('hidden');
    $post.find('p').toggleClass('hidden');
  });

  $('#postTarget').on('click', '.update-post-button', function(e){
    console.log("updating",e);
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

  $('#postTarget').on('submit', '.comment-form', function(e){
    e.preventDefault();
    var postId = $(this).closest('.post').data('post-id');
    var newComment =$.ajax({
      method: 'POST',
      url: '/api/posts/' + postId + '/comments',
      data: {
        author: user,
        text: $(this).find('.comment-input').val(),
        likes: 0
      },
      success: createCommentSuccess,
      error: createCommentError
    });
    $('.comment-input').val('');
    console.log(postId);
    $.when(newComment).done($.get('/api/posts/' + postId).success(renderSinglePost));
  });

  $('#postTarget').on('click', '.edit-comment-button', function(e){
    e.preventDefault(e);
    var $comment = $(this).closest('.comment');
    $(this).toggleClass('hidden');
    $comment.find('.update-comment-button').toggleClass('hidden');
    $comment.find('.comment-edit-input').toggleClass('hidden');
    $comment.find('.comment-text').toggleClass('hidden');
  });

  $('#postTarget').on('submit', '.comment-edit-form', function(e){
    e.preventDefault();
    var $post = $(this).closest('.post');
    var postId = $post.data('post-id');
    var $comment = $(this).closest('.comment');
    var commentId = $comment.data('comment-id');
    $comment.find('.comment-edit-input').val();
    $.ajax({
      method: 'PUT',
      url: '/api/posts/' + postId + '/comments/' + commentId,
      data: {
        text: $comment.find('.comment-edit-input').val(),
        likes: 0
      },
      success: updateCommentSuccess,
      error: updateCommentError
    });
  });

  $('#postTarget').on('click', '.update-comment-button', function(e){
    e.preventDefault();
    var $post = $(this).closest('.post');
    var postId = $post.data('post-id');
    var $comment = $(this).closest('.comment');
    var commentId = $comment.data('comment-id');
    $comment.find('.comment-edit-input').val();
    $.ajax({
      method: 'PUT',
      url: '/api/posts/' + postId + '/comments/' + commentId,
      data: {
        text: $comment.find('.comment-edit-input').val(),
        likes: 0
      },
      success: updateCommentSuccess,
      error: updateCommentError
    });
  });

  $('#postTarget').on('click', '.like-comment-button', function(e){
    e.preventDefault();
    var $post = $(this).closest('.post');
    var postId = $post.data('post-id');
    var $comment = $(this).closest('.comment');
    var commentId = $comment.data('comment-id');
    $.ajax({
      method: 'PUT',
      url: '/api/posts/' + postId + '/comments/' + commentId,
      data: {
        text: $comment.find('.comment-edit-input').val(),
        likes: $(this).val()
      },
      success: likeCommentSuccess,
      error: likeCommentError
    });
  });

  $('#postTarget').on('click', '.delete-comment-button', function(e){
    e.preventDefault();
    var $post = $(this).closest('.post');
    var postId = $post.data('post-id');
    var $comment = $(this).closest('.comment');
    var commentId = $comment.data('comment-id');
    $.ajax({
      method: 'DELETE',
      url: '/api/posts/' + postId + '/comments/' + commentId,
      success: deleteCommentSuccess,
      error: deleteCommentError
    });
  });

  $('.user-search').on('submit', function(e){
    e.preventDefault();
    console.log("user",$('.user-search-input').val());
    $.ajax({
      method: 'GET',
      url: '/api/users/' + $('.user-search-input').val(),
      success: searchUserSuccess,
      error: searchUserError
    });
    $('.user-search-input').val('');
  });

  $('.found-user-modal-body').on('click', '.add-friend-button', function(e){
    e.preventDefault();
    console.log(e);
    console.log("user",user._id);
    console.log("requested",$(this).closest('.row').data('user-id'));
    $.ajax({
    method: 'PUT',
    url: '/api/users/' + user._id,
    data: {
      _id: $(this).closest('.row').data('user-id'),
      type: "add"
    },
    success: addFriendSuccess,
    error: addFriendError
    });
  });

  $('.found-user-modal-body').on('click', '.delete-friend-button', function(e){
    e.preventDefault();
    console.log(e);
    console.log("user",user._id);
    console.log("requested",$(this).closest('.row').data('user-id'));
    $.ajax({
    method: 'PUT',
    url: '/api/users/' + user._id,
    data: {
      _id: $(this).closest('.row').data('user-id'),
      type: "remove"
    },
    success: removeFriendSuccess,
    error: removeFriendError
    });
  });


});

function addFriendSuccess(data){
  console.log(data);
  var newFriendId = data.friends[user.friends.length-1]._id;
  $('.found-user-modal').find("[data-user-id='" + newFriendId + "']").find('.add-friend-button').toggleClass("hidden");
  $('.found-user-modal').find("[data-user-id='" + newFriendId + "']").find('.delete-friend-button').toggleClass("hidden");
}

function addFriendError(err){
  console.log(err);
}

function searchUserSuccess(users){
  $foundUserList.empty();
  users.forEach(function(user){
    foundUserHtml = foundUserTemplate(user);
    console.log(foundUserHtml);
    $foundUserList.append(foundUserHtml);
  });
  $('.found-user-modal').modal('show');
}

function searchUserError(err){
  console.log(err);
}

function deleteCommentSuccess(commentId){
  // console.log($('#postTarget').find('[data-comment-id="' + commentId + '"]'));
  $('#postTarget').find('[data-comment-id="' + commentId + '"]').remove();
}

function deleteCommentError(err){
  console.log(err);
}

function likeCommentSuccess(comment){
  console.log(comment);
  var symbol = $('#postTarget').find('[data-comment-id="' + comment._id + '"]').find('.like-comment-button').text();
  renderSingleCommentInPlace(comment);
  var $likeButton = $('#postTarget').find('[data-comment-id="' + comment._id + '"]').find('.like-comment-button');
  if (symbol === "+"){
    $likeButton.text("-");
    $likeButton.val("-1");
  } else {
    $likeButton.text("+");
    $likeButton.val("1");
  }
}

function likeCommentError(err){
  console.log(err);
}

function updateCommentSuccess(comment){
  console.log(comment);
  var symbol = $('#postTarget').find('[data-comment-id="' + comment._id + '"]').find('.like-comment-button').text();
  renderSingleCommentInPlace(comment);
  var $likeButton = $('#postTarget').find('[data-comment-id="' + comment._id + '"]').find('.like-comment-button');
  if (symbol === "+"){
    $likeButton.text("+");
    $likeButton.val("1");
  } else {
    $likeButton.text("-");
    $likeButton.val("-1");
  }
}

function updateCommentError(err){
  console.log(err);
}


function createCommentSuccess(comment){
  console.log(comment);

}

function createCommentError(err){
  console.log(err);
}

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

function deletePostSuccess(postId){
  $('#postTarget').find('[data-post-id="' + postId + '"]').remove();
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
  console.log(post.author);
  renderPost(post);
}

function newPostError(err){
  console.log(err);
}

function initPopOver(postId){
  $('#postTarget').find('[data-post-id="' + postId + '"]').find('.comment-button').popover({
    placement: 'bottom',
    title: 'Add a comment',
    html: true,
    content: $('.comment-form').html()
  });
}

function renderSingleCommentInPlace(comment){
  var commentHtml = commentTemplate(comment);
  $('#postTarget').find('[data-comment-id="' + comment._id + '"]').html(commentHtml);
}

function renderSinglePost(post){
  var postHtml = postTemplate(post);
  console.log(post);
  console.log(postHtml);
  console.log(post._id);
  $('#postTarget').find('[data-post-id="' + post._id + '"]').html(postHtml);
  // initPopOver(post._id);
}

function renderPost(post){
  var postHtml = postTemplate(post);
  $postList.prepend(postHtml);
  // initPopOver(post._id);
}
