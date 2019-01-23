jQuery( document ).ready(function($) {

    var myInput    = jQuery('#cloudflare-stream-file-input');

    myInput.on("change", function(e) {

        var file = jQuery("#cloudflare-stream-file-input:input[type='file']")[0].files[0];

        var data = {
            'filename': file.name
        };

        var responseInput = jQuery('#cloudflare-stream-response');
        var base_url = 'https://api.cloudflare.com/client/v4/zones/' + zone + '/media';

        responseInput.text("Uploading...");

        // Create a new tus upload
        var upload = new tus.Upload(file, {

            endpoint: base_url,
            retryDelays: [0, 1000, 3000, 5000],
            headers: {
                'X-Auth-Email' : xAuthEmail,
                'X-Auth-Key'   : xAuthKey,
            },
            onError: function(error) {
                responseInput.text("Failed because: " + error);
            },
            onProgress: function(bytesUploaded, bytesTotal) {
                var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                responseInput.text("bytes uploaded: " + bytesUploaded +"\n" +
                "bytes total: " + bytesTotal + "\n" +
                "bytes percentage: " + percentage + "%" )
            },
            onSuccess: function() {
                console.log("Download %s from %s", upload.file.name, upload.url)
                responseInput.text( "Complete" );
            }
        })
        // Start the upload
        upload.start();

    })
});