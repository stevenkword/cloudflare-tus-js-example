jQuery( document ).ready(function($) {

    var myInput    = jQuery('#cloudflare-stream-file-input');

    myInput.on("change", function(e) {

        var file = jQuery("#cloudflare-stream-file-input:input[type='file']")[0].files[0];

        var data = {
            'filename': file.name
        };

        var responseInput = jQuery('#cloudflare-stream-response');
        var base_url = 'https://api.cloudflare.com/client/v4/zones/' + zone + '/media';

        $.ajax({
            url: base_url,
            type: 'post',
            contentType: 'application/x-www-form-urlencoded',
            headers: {
                'X-Auth-Email' : xAuthEmail,
                'X-Auth-Key'   : xAuthKey,
                'Tus-Resumable': '1.0.0',
                'Upload-Length': file.size
            },
            data: data,
            success: function( data, textStatus, response ){
                responseInput.text("Uploading...");

                // Create a new tus upload
                var upload = new tus.Upload(file, {

                    endpoint: response.getResponseHeader('location'),
                    retryDelays: [0, 1000, 3000, 5000],
                    headers: {
                        'X-Auth-Email' : xAuthEmail,
                        'X-Auth-Key'   : xAuthKey,
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

            },
            error: function( jqXhr, textStatus, errorThrown ){
                console.log( errorThrown );
            }
        });
    })
});