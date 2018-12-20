//import tus from "tus-js-client";

var input = jQuery('#cloudflare-stream-file-input');

input.addEventListener("change", function(e) {

    var file = jQuery("#cloudflare-stream-file-input:input[type='file']")[0].files[0];
    console.log(file);

    var responseInput = jQuery('#cloudflare-stream-response');

    // Create a new tus upload
    var upload = new tus.Upload(file, {
        endpoint: response.data.location,
        retryDelays: [0, 1000, 3000, 5000],
        headers: {
            'X-Auth-Email':'steven.word@wpengine.com',
            'X-Auth-Key':'36c6251c7ed10da7a808918b05e480e89298e',
        },
        onError: function(error) {
            responseInput.text("Failed because: " + error);
        },
        onProgress: function(bytesUploaded, bytesTotal) {
            var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
            responseInput.text(bytesUploaded, bytesTotal, percentage + "%")
        },
        onSuccess: function() {
            console.log("Download %s from %s", upload.file.name, upload.url)
            responseInput.text( "Complete" );
        }
    })
    // Start the upload
    upload.start();
})