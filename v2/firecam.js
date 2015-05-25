var FireCam = function(elmId) {

  var videoElm;
  var paramName;
  var broadcastId = null;
  var mediaHandler = null;
  var fireBaseConnection = null;
  var that = this;
  var ready = false;

  this.init = function(elmId) {

    that.paramName = "fcbid";
    that.videoElm = document.getElementById(elmId)

    if (that.videoElm == undefined) {
      console.error("You must specifiy an HTML5 video element")
    } else {
      that.ready = true
      that.broadcastId = that.getUrlParameter(that.paramName)

      if (!that.broadcastId) {
        that.broadcastId = that.getNewBroadcastId()
      }

      that.setupFirebaseConnection()
    }

  }

  this.setupFirebaseConnection = function () {
    that.fireBaseConnection = new Firebase("https://firecamera.firebaseio.com/" + that.paramName + "/"+ that.broadcastId);
  }

  this.setupVideo = function () {
    that.mediaHandler = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);

    if (!that.mediaHandler) {
      console.error("Unsupported browser, sorry!")
    } else {
      that.createCanvas()
      that.mediaHandler = that.mediaHandler.bind(navigator)
      that.mediaHandler({ video: true }, that.onConnect, that.onError);
      setInterval(function() { that.stream() },300);
    }
  }

  that.createCanvas = function() {
    var canvas = document.createElement('canvas');
    canvas.id = "firecam_canvas_" + that.broadcastId;

    //add canvas to the body element
    document.body.appendChild(canvas);

  }

  this.onConnect = function(stream) {

    that.getVideoElm().src = window.URL ? window.URL.createObjectURL(stream) : stream;
    that.getVideoElm().play();
  }

  this.onError = function(e) {
    console.error("Something is broken. " + e)
    that.fireBaseConnection = null
  }

  this.sampleVideo = function() {

    var canvas = document.getElementById("firecam_canvas_" + that.broadcastId)
    //add canvas to #canvasHolder
    // document.getElementById('canvasHolder').appendChild(canvas);
    var ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 600;
    ctx.drawImage(that.videoElm, 0, 0, canvas.width, canvas.height);

    //save canvas image as data url
    dataURL = canvas.toDataURL();

    return dataURL;
  }

  this.startBroadcasting = function() {

    if (that.ready == true ) {
      that.setupVideo()
    }

  }

  this.getWatchLink = function () {

    return window.location.href + "?" + that.paramName + "=" + that.broadcastId
  }

  this.stream = function() {
    var imagebase = that.sampleVideo()

    that.fireBaseConnection.update({base64:imagebase});
  }

  // Watch a stream, optional different broadcast id param to provide an option for multiple streams in one page.at
  that.watch = function(otherBroadcastId) {

    if (otherBroadcastId) {
      that.broadcastId = otherBroadcastId
      that.setupFirebaseConnection()
    }

    that.fireBaseConnection.on("value", function(snapshot) {

        var data = snapshot.val();
        that.videoElm.src = data.base64; // Actually an IMG tag, but we are doing a dual-use library here.
    });
  }

  // Extract get parameters
  this.getUrlParameter = function(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
  }

  this.getVideoElm = function() {
    return that.videoElm
  }
  this.getBroadcastId = function() {
    return that.broadcastId
  }
  this.getNewBroadcastId = function() {
    return Math.random().toString(36).substring(2);
  }

  this.init(elmId);
}
