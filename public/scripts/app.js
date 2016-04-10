var postTemplate;
var $postList;
var commentTemplate;
var foundUserTemplate;
var $foundUserList;
var likeTemplate;
var inputImage;





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
  // var likeSource = $('#like-display-template').html();
  // likeTemplate = Handlebars.compile(likeSource);
  console.log(user);

  $.ajax({
    method: 'GET',
    url: '/api/friends/' + user._id + '/posts',
    success: getAllPostSuccess,
    error: getAllPostError
  });

  // $.ajax({
  //   method: 'GET',
  //   url: '/api/posts',
  //   success: getAllPostSuccess,
  //   error: getAllPostError
  // });


  $('#newPostForm').on('submit', function(e){
    e.preventDefault();

    var postStr = $('.post-input').val();
    var gif = gifParser(postStr);
    var img = imgParser(postStr);
    var gifPromise;
    if (gif) {
      gifPromise = $.ajax({
        method: 'GET',
        url: 'http://api.giphy.com/v1/gifs/random',
        data: {
          api_key: 'dc6zaTOxFJmzC',
          tag: gif,
        },
        success: gifSuccess,
        error: gifError
      });
      gifPromise.then(function(){
        $.ajax({
          method: 'POST',
          url: '/api/posts',
          data: {
            text: $('.post-input').val(),
            image: inputImage,
          },
          success: newPostSuccess,
          error: newPostError
        });
      });
    } else if (img) {
      inputImage = img;
      $.ajax({
        method: 'POST',
        url: '/api/posts',
        data: {
          text: $('.post-input').val(),
          image: inputImage,
        },
        success: newPostSuccess,
        error: newPostError
      });
    } else {
      $.ajax({
        method: 'POST',
        url: '/api/posts',
        data: {
          text: $('.post-input').val(),
          image: inputImage,
        },
        success: newPostSuccess,
        error: newPostError
      });
    }
  });

  $('#postTarget').on('click', '.like-post-button', function(e){
    console.log(e);
    e.preventDefault();
    var $post = $(this).closest('.post');
    var postId = $post.data('post-id');
    $.ajax({
      method: 'PUT',
      url: '/api/posts/' + postId + '/likes/' + user._id,
      data: null,
      success: likePostSuccess,
      error: likePostError
    });
  });

  $('#postTarget').on('mouseover', '.like-post-display', function(e){
    e.preventDefault();
    $(this).popover({
      html: true,
      title: "Likes",
      content: function(){
        if($(this).closest('.post').find('.like-popover').html().trim() === ""){
          return "Shit Post";
        } else {
          return $(this).closest('.post').find('.like-popover').html();
        }
      }
    });
  });

  $('#postTarget').on('mouseover', '.like-comment-display', function(e){
    e.preventDefault();
    $(this).popover({
      html: true,
      title: "Likes",
      content: function(){
        if($(this).closest('.comment').find('.like-popover').html().trim() === ""){
          return "Shit Comment";
        } else {
          return $(this).closest('.comment').find('.like-popover').html();
        }
      }
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
    // console.log("edit",event);
    e.preventDefault();
    var $post = $(this).closest('.post');
    var postId = $post.data('post-id');
    $(this).toggleClass('hidden');
    $post.find('.update-post-button').toggleClass('hidden');
    $post.find('.edit-post-form').toggleClass('hidden');
    $post.find('.post-text-display').toggleClass('hidden');
  });

  $('#postTarget').on('click', '.update-post-button', function(e){
    // console.log("updating",e);
    var $post = $(this).closest('.post');
    var postId = $post.data('post-id');


    var postStr = $post.find('.edit-post-form').val();
    var gif = gifParser(postStr);
    var img = imgParser(postStr);
    var gifPromise;
    if (gif) {
      gifPromise = $.ajax({
        method: 'GET',
        url: 'http://api.giphy.com/v1/gifs/random',
        data: {
          api_key: 'dc6zaTOxFJmzC',
          tag: gif,
        },
        success: gifSuccess,
        error: gifError
      });
      gifPromise.then(function(){
        $.ajax({
          method: 'PUT',
          url: '/api/posts/' + postId,
          data: {
            text: $post.find('.edit-post-form').val(),
            image: inputImage
          },
          success: updatePostSuccess,
          error: updatePostError
        });
      });
    } else if (img) {
      inputImage = img;
      $.ajax({
        method: 'PUT',
        url: '/api/posts/' + postId,
        data: {
          text: $post.find('.edit-post-form').val(),
          image: inputImage
        },
        success: updatePostSuccess,
        error: updatePostError
      });
    } else {
      $.ajax({
        method: 'PUT',
        url: '/api/posts/' + postId,
        data: {
          text: $post.find('.edit-post-form').val(),
          image: inputImage
        },
        success: updatePostSuccess,
        error: updatePostError
      });
    }
  });

  $('#postTarget').on('submit', '.comment-form', function(e){
    e.preventDefault();
    var postId = $(this).closest('.post').data('post-id');
    var postStr = $(this).find('.comment-input').val();
    var gif = gifParser(postStr);
    var img = imgParser(postStr);
    var gifPromise;
    if (gif) {
      console.log("in gif");
      gifPromise = $.ajax({
        method: 'GET',
        url: 'http://api.giphy.com/v1/gifs/random',
        data: {
          api_key: 'dc6zaTOxFJmzC',
          tag: gif,
        },
        success: gifSuccess,
        error: gifError
      });
      gifPromise.then(function(){
        console.log("text in input",$(this).find('.comment-input').val());
        var newComment = $.ajax({
          method: 'POST',
          url: '/api/posts/' + postId + '/comments',
          data: {
            author: user,
            text: postStr,
            image: inputImage
          },
          success: createCommentSuccess,
          error: createCommentError
        });
        $.when(newComment).done(function(){
          $.get('/api/posts/' + postId).success(renderSinglePost);
        });
      });
    } else if (img) {
      console.log("in img");
      inputImage = img;
      var newComment = $.ajax({
        method: 'POST',
        url: '/api/posts/' + postId + '/comments',
        data: {
          author: user,
          text: postStr,
          image: inputImage
        },
        success: createCommentSuccess,
        error: createCommentError
      });
      $.when(newComment).done(function(){
        $.get('/api/posts/' + postId).success(renderSinglePost);
      });
    } else {
      console.log("in reg");
      var newComment = $.ajax({
        method: 'POST',
        url: '/api/posts/' + postId + '/comments',
        data: {
          author: user,
          text: postStr,
          image: inputImage
        },
        success: createCommentSuccess,
        error: createCommentError
      });
      $.when(newComment).done(function(){
        $.get('/api/posts/' + postId).success(renderSinglePost);
      });
    }
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

    var postStr = $comment.find('.comment-edit-input').val();
    var gif = gifParser(postStr);
    var img = imgParser(postStr);
    var gifPromise;
    if (gif) {
      console.log("in gif");
      gifPromise = $.ajax({
        method: 'GET',
        url: 'http://api.giphy.com/v1/gifs/random',
        data: {
          api_key: 'dc6zaTOxFJmzC',
          tag: gif,
        },
        success: gifSuccess,
        error: gifError
      });
      gifPromise.then(function(){
        $.ajax({
          method: 'PUT',
          url: '/api/posts/' + postId + '/comments/' + commentId,
          data: {
            text: postStr,
            image: inputImage
          },
          success: updateCommentSuccess,
          error: updateCommentError
        });
      });
    } else if (img) {
      console.log("in img");
      inputImage = img;
      $.ajax({
        method: 'PUT',
        url: '/api/posts/' + postId + '/comments/' + commentId,
        data: {
          text: postStr,
          image: inputImage
        },
        success: updateCommentSuccess,
        error: updateCommentError
      });
    } else {
      console.log("in reg");
      $.ajax({
        method: 'PUT',
        url: '/api/posts/' + postId + '/comments/' + commentId,
        data: {
          text: postStr,
          image: inputImage
        },
        success: updateCommentSuccess,
        error: updateCommentError
      });
    }
  });


  $('#postTarget').on('click', '.update-comment-button', function(e){
    e.preventDefault();
    var $post = $(this).closest('.post');
    var postId = $post.data('post-id');
    var $comment = $(this).closest('.comment');
    var commentId = $comment.data('comment-id');

    var postStr = $comment.find('.comment-edit-input').val();
    var gif = gifParser(postStr);
    var img = imgParser(postStr);
    var gifPromise;
    if (gif) {
      console.log("in gif");
      gifPromise = $.ajax({
        method: 'GET',
        url: 'http://api.giphy.com/v1/gifs/random',
        data: {
          api_key: 'dc6zaTOxFJmzC',
          tag: gif,
        },
        success: gifSuccess,
        error: gifError
      });
      gifPromise.then(function(){
        $.ajax({
          method: 'PUT',
          url: '/api/posts/' + postId + '/comments/' + commentId,
          data: {
            text: postStr,
            image: inputImage
          },
          success: updateCommentSuccess,
          error: updateCommentError
        });
      });
    } else if (img) {
      console.log("in img");
      inputImage = img;
      $.ajax({
        method: 'PUT',
        url: '/api/posts/' + postId + '/comments/' + commentId,
        data: {
          text: postStr,
          image: inputImage
        },
        success: updateCommentSuccess,
        error: updateCommentError
      });
    } else {
      console.log("in reg");
      $.ajax({
        method: 'PUT',
        url: '/api/posts/' + postId + '/comments/' + commentId,
        data: {
          text: postStr,
          image: inputImage
        },
        success: updateCommentSuccess,
        error: updateCommentError
      });
    }
  });

  $('#postTarget').on('click', '.like-comment-button', function(e){
    e.preventDefault();
    var $post = $(this).closest('.post');
    var postId = $post.data('post-id');
    var $comment = $(this).closest('.comment');
    var commentId = $comment.data('comment-id');
    $.ajax({
      method: 'PUT',
      url: '/api/posts/' + postId + '/comments/' + commentId + '/likes/' + user._id,
      data: null,
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
      method: 'POST',
      url: '/api/users/' + user._id + '/friends/' + $(this).closest('.row').data('user-id'),
      data: null,
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
      method: 'DELETE',
      url: '/api/users/' + user._id + '/friends/' + $(this).closest('.row').data('user-id'),
      data: null,
      success: removeFriendSuccess,
      error: removeFriendError
    });
  });


});


function removeFriendSuccess(friend){
  console.log(friend);
  $('.found-user-modal').find("[data-user-id='" + friend._id + "']").find('.add-friend-button').toggleClass("hidden");
  $('.found-user-modal').find("[data-user-id='" + friend._id + "']").find('.delete-friend-button').toggleClass("hidden");
}

function removeFriendError(err){
  console.log(err);
}

function addFriendSuccess(friend){
  console.log (friend);
  $('.found-user-modal').find("[data-user-id='" + friend._id + "']").find('.add-friend-button').toggleClass("hidden");
  $('.found-user-modal').find("[data-user-id='" + friend._id + "']").find('.delete-friend-button').toggleClass("hidden");
}

function addFriendError(err){
  console.log(err);
}

function searchUserSuccess(foundUsers){
  $foundUserList.empty();
  foundUsers.forEach(function(foundUser){
    foundUserHtml = foundUserTemplate(foundUser);
    $foundUserList.append(foundUserHtml);
    user.friends.forEach(function(friend){
      if ( friend.toString() === foundUser._id.toString() ){
        $('.found-user-modal').find("[data-user-id='" + foundUser._id + "']").find('.add-friend-button').toggleClass("hidden");
        $('.found-user-modal').find("[data-user-id='" + foundUser._id + "']").find('.delete-friend-button').toggleClass("hidden");
      }
    });
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
  renderSingleCommentInPlace(comment);
  var $likeButton = $('#postTarget').find('[data-comment-id="' + comment._id + '"]').find('.like-comment-button');
  var liked;
  comment.likes.forEach(function(like){
    if (like._id.toString() === user._id.toString()) {
      liked = true;
    }
  });
  if(liked){
    $likeButton.text("-");
  } else {
    $likeButton.text("+");
  }
}

function likeCommentError(err){
  console.log(err);
}

function updateCommentSuccess(comment){
  console.log(comment);
  renderSingleCommentInPlace(comment);
  var $likeButton = $('#postTarget').find('[data-comment-id="' + comment._id + '"]').find('.like-comment-button');
  var liked;
  comment.likes.forEach(function(like){
    if (like._id.toString() === user._id.toString()) {
      liked = true;
    }
  });
  if(liked){
    $likeButton.text("-");
  } else {
    $likeButton.text("+");
  }
}

function updateCommentError(err){
  console.log(err);
}


function createCommentSuccess(comment){
  console.log(comment);
  inputImage = null;
  $('.comment-input').val('');
}

function createCommentError(err){
  console.log(err);
}

function updatePostSuccess(post){
  // console.log('post',post);
  renderSinglePost(post);
  inputImage = null;
  var $likeButton = $('#postTarget').find('[data-post-id="' + post._id + '"]').find('.like-post-button');
  var liked;
  post.likes.forEach(function(like){
    if (like._id.toString() === user._id.toString()) {
      liked = true;
    }
  });
  if(liked){
    $likeButton.text("-");
  } else {
    $likeButton.text("+");
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
  // console.log('post',post);
  renderSinglePost(post);
  var $likeButton = $('#postTarget').find('[data-post-id="' + post._id + '"]').find('.like-post-button');
  var liked;
  post.likes.forEach(function(like){
    if (like._id.toString() === user._id.toString()) {
      liked = true;
    }
  });
  if(liked){
    $likeButton.text("-");
  } else {
    $likeButton.text("+");
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
  // console.log(post.author);
  renderPost(post);
  $('.post-input').val('');
  inputImage = null;
}

function newPostError(err){
  console.log(err);
}

function gifSuccess(json){
  // console.log(json);
  inputImage = json.data.fixed_height_small_url;
  // console.log("IMAGE",inputImage);
}

function gifError(err){
  console.log(err);
}

function gifParser(str){
  var word;
  var arr = str.split(' ');
  arr.forEach(function(el){
    if (el[0] === "/"){
      word = el.slice(1,el.length);
    }
  });
  console.log("WORD",word);
  return word;
}

function imgParser(str){
  var formats = [".jpg", ".jpeg", ".tif", ".png", ".gif"];
  var word;
  var arr = str.split(' ');
  arr.forEach(function(el){
    formats.forEach(function(format){
      if (el.includes(format)){
        word = el;
      }
    });
  });
  return word;
}

function initPopOver(postId){
  $('#postTarget').find('[data-post-id="' + postId + '"]').find('.like-display-button').popover({
    placement: 'bottom',
    title: 'Likes',
    html: true,
    content: $('#postTarget').find('[data-post-id="' + postId + '"]').find('.like-popover').html()
  });
}

function renderSingleCommentInPlace(comment){
  var commentHtml = commentTemplate(comment);
  // console.log("before",$('#postTarget').find('[data-comment-id="' + comment._id + '"]').clone(true).html());
  // console.log("replace by",commentHtml);
  $('#postTarget').find('[data-comment-id="' + comment._id + '"]').html(commentHtml);
}

function renderSinglePost(post){
  var postHtml = postTemplate(post);
  // console.log(postHtml);
  // console.log($('#postTarget').find('[data-post-id="' + post._id + '"]').html());
  $('#postTarget').find('[data-post-id="' + post._id + '"]').html(postHtml);
  // initPopOver(post._id);
}

function renderPost(post){
  // console.log(post);
  var postHtml = postTemplate(post);
  $postList.prepend(postHtml);
  // initPopOver(post._id);
}
