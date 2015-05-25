var FireCam = {

    constructure: function() {
      this.video = '';
      this.dataURL = '';


    },
    broadcast: function() {

        navigator.myGetMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
        navigator.myGetMedia({ video: true }, this.connect, this.error);

        document.getElementById('broadcastidspan').innerHTML = document.broadcastinit;

        setInterval(function() {FireCam.firebaseBroadcastImage()},300);

    },

    connect: function(stream) {
        video = document.getElementById("video");
        video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
        video.play();
    },

    error: function (e) { console.log(e); },

    getImage: function() {
        var canvas = document.createElement('canvas');
        canvas.id = 'hiddenCanvas';
        //add canvas to the body element
        document.body.appendChild(canvas);
        //add canvas to #canvasHolder
        document.getElementById('canvasHolder').appendChild(canvas);
        var ctx = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 480;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        //save canvas image as data url
        dataURL = canvas.toDataURL();

        return dataURL;
    },

    firebaseBroadcastImage: function() {

      var myFirebaseRef = new Firebase("https://firecamera.firebaseio.com/c/"+document.broadcastinit);
      var imagebase = this.getImage();
      myFirebaseRef.update({base64:imagebase});

    },

    getUrlParameter: function(sParam)
    {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++)
        {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam)
            {
                return sParameterName[1];
            }
        }
    },
    watch: function(divid) {

      var myFirebaseRef = new Firebase("https://firecamera.firebaseio.com/c/"+document.broadcastinit);

      myFirebaseRef.on("value", function(snapshot) {

          var data = snapshot.val();
          document.getElementById(divid).src = data.base64;
          document.getElementById('broadcastidspan').innerHTML = document.broadcastinit;
      });
    }
}
