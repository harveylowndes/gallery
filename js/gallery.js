    var images = (function() {

        var imageArray = $('.gallery .container .frame .image');
        var currentImageIndex = 0;

        var getImageArray = function() {
            return $(imageArray);
        };

        var setCurrentImageIndex = function(newIndex) {
            currentImageIndex = newIndex;
        };

        var getImage = function(index) {
            return $(getImageArray()).get(index);
        };

        var getImageSource = function(index) {
            var image = getImage(index);
            var img = $(image).find('img').get(0);
            var src = $(img).attr('src');
            return src;
        };

        var getCurrentImageIndex = function() {
            return currentImageIndex;
        };

        var clearCurrentImage = function() {
            var current = getImage(getCurrentImageIndex());
            $(current).fadeOut().css('display', 'none');

            var currentThumbnail = $(thumbnails.getThumbnailArray()).find('div').get(getCurrentImageIndex());
            $(currentThumbnail).removeClass('active');
        };

        /*
            Display new image.
        */
        var displayImage = function(index) {
            var image = getImage(index);
            $(image).fadeIn().css('display', 'inline-block');

            var imageThumbnail = $(thumbnails.getThumbnailArray()).find('div').get(index);
            $(imageThumbnail).addClass('active');

            thumbnails.scrollThumbnails(); //Scroll to correct thumb.
        };

        /*
            Display next image.
         */
        var displayNextImage = function() {
            clearCurrentImage();
            var nextImage = getCurrentImageIndex() + 1;
            setCurrentImageIndex(getCurrentImageIndex() + 1);
            if (nextImage > getImageArray().length - 1) {
                nextImage = 0;
                setCurrentImageIndex(0);
            }
            displayImage(nextImage);
        };

        /*
            Display previous image.
         */
        var displayPreviousImage= function() {
            clearCurrentImage();
            var previousImage = getCurrentImageIndex() - 1;
            setCurrentImageIndex(getCurrentImageIndex() - 1);
            if (previousImage < 0) {
                previousImage = getImageArray().length-1;
                setCurrentImageIndex(images.getImageArray().length-1);
            }
            displayImage(previousImage);
        };

        // Public API
        return {
            getCurrentImageIndex : getCurrentImageIndex,
            setCurrentImageIndex : setCurrentImageIndex,
            getImageArray : getImageArray,
            getImageSource : getImageSource,
            displayImage : displayImage,
            displayPreviousImage, displayPreviousImage,
            displayNextImage : displayNextImage,
            clearCurrentImage : clearCurrentImage
        };

    })();

    var thumbnails = (function() {
        var thumbnailArray = $('.gallery .container .thumbnails');

        var getThumbnailArray = function() {
            return $(thumbnailArray);
        };

        var initThumbnails = function() {
            images.getImageArray().each(function(index) {
                var src = images.getImageSource(index);
                $(getThumbnailArray()).append('<div><img src="' + src + '" /></div>');
            });
        };

        var getScrollWidth = function() {
            var width = 0;
            var currentIndex = images.getCurrentImageIndex();
            if(currentIndex - 1 != -1) {
                for (var i = 0; i < images.getCurrentImageIndex() - 1; i++) {
                    var current = $(getThumbnailArray()).find('div').get(i);
                    var image = $(current).find('img').get(0);
                    width = width + $(image).width();
                }
                return width;
            } else {
                return 0;
            }
        };

        /*
            Scroll to correct thumbnail.
        */
        var scrollThumbnails = function() {
            $(getThumbnailArray()).animate({
                scrollLeft: getScrollWidth()
            }, 500);
        };

        return {
            getThumbnailArray : getThumbnailArray,
            initThumbnails : initThumbnails,
            scrollThumbnails : scrollThumbnails
        };

    })();

    var interval = (function() {

        var cycleTime = 3000; //In m/s
        var _intervalId;

        /*
            Interval manager for cycle.
        */
        var intervalManager = function(flag, animate, time) {
            if (flag)
                _intervalId = setInterval(animate, time);
            else
                clearInterval(_intervalId);
        };

        /*
            Starts the interval.
        */
        var startInterval = function() {
            intervalManager(true, images.displayNextImage, 5000);
        };

        /*
            Restarts the interval.
        */
        var resetInterval = function() {
            intervalManager(false); //Clear the interval.
            startInterval(); //Start the interval.
        };

        return {
            startInterval : startInterval,
            resetInterval: resetInterval
        };
        
    })();


$(document).ready(function() {

    //Controls
    $('.gallery .container .frame')
        .append('<span id="previous" class="control"></span><span id="next" class="control"></span>');

    //Show image on load.
    images.displayImage(images.getCurrentImageIndex());

    //Generate thumbnails
    thumbnails.initThumbnails();

    //Set first thumb active.
    var currentThumbnail = $(thumbnails.getThumbnailArray()).find('div').get(images.getCurrentImageIndex());
    $(currentThumbnail).addClass('active');

    //Start interval.
    interval.startInterval();

    $("#previous").click(function() { //Previous control click.
        images.displayPreviousImage();
        interval.resetInterval();
    });

    $("#next").click(function() { //Next control click.
        images.displayNextImage();
        interval.resetInterval();
    });

    $(thumbnails.getThumbnailArray()).find("div").click(function() {
        var divIndex = $(this).index();
        if(divIndex != images.getCurrentImageIndex()) { //Disable double clicking of thumb.
            images.clearCurrentImage(); //Clear current image from browser.
            images.setCurrentImageIndex(divIndex); // Set current images index.
            images.displayImage(images.getCurrentImageIndex()); // **Call it!!
            interval.resetInterval(); //Restart the interval.)
        }
    });

});


