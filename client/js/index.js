const HOST = "http://192.168.1.8:80/";

var app = angular.module('app', []);

app.controller('post', ($scope, $http) => {
    var post_id = 0;

    function initialize(post) {
        $scope.post = post;
        $scope.GetComments();
        $scope.hideErrorMessage();
    }

    $scope.NextPage = () => {
        $http.get(
            HOST + 'post.php?post_id=' + (++post_id), {
            headers: {'Access-Control-Allow-Origin' : "*"}} )
        .then(res => {
                if (res.data.length == 0) post_id--;
                else initialize(res.data);
            },
            err => console.error(err));
    };

    $scope.PreviousPage = () => {
        if (post_id <= 1) return;
        else post_id -= 2;
        $scope.NextPage();
    };

    $scope.GetComments = () => {
        $http.get(
            HOST + 'comments.php?post_id=' + post_id, {
            headers: {'Access-Control-Allow-Origin' : "*"}} )
        .then(res => $scope.comments = res.data,
            err => console.error(err));
    };

    $scope.AddComment = () => {
        var text = commentArea.value;
        if (text.length > 4) {
            $scope.hideErrorMessage();
            $http.post(
                HOST + 'addcomment.php', {
                "post_id": post_id,
                "text": text
                }, {
                headers: {'Access-Control-Allow-Origin' : "*"}} )
            .then(res => { 
                // TODO: recive adding status
                $scope.GetComments();
                commentArea.value = "";
            },
                err => console.error(err));
        }
        else {
            commentErrorMessage.innerHTML = "Your comment must be at least five characters long";
            commentErrorMessage.setAttribute('style', 'display:block;');
        }
    };

    $scope.hideErrorMessage = () => {
        commentErrorMessage.setAttribute('style', 'display:none;');
    };

    $scope.Like = () => {
        $http.get(
            HOST + 'like.php?post_id=' + post_id, {
            headers: {'Access-Control-Allow-Origin' : "*"}} )
        .then(res => {
                // TODO: recive adding status
                $scope.post.likes++;
            },
            err => console.error(err));
    }

    $scope.NextPage();
});


function onLoad() {
    // TODO: ???
    /*
    document.addEventListener('swiperight', onSwipeRight, false);
    document.addEventListener('swipeleft', onSwipeLeft, false);
    document.addEventListener('onclick', onClick, false);

    post.bind("swipeleft", onSwipeLeft);
    post.bind("swipeleft", onSwipeRight);
    post.bind("click", onClick);
    */
}

document.addEventListener('deviceready', onLoad, false);
