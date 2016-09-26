/*
	JS Image Gallery 
	Harvey Lowndes
 */

$(document).ready(function() {

    var images = $('.gallery .container .image'); //Get all image elements.
    var thumbnails = $('.gallery .container .thumbnails'); //Get the thumnail element.
    var currentImage = 0; //The current image index.
    var scrollWidth = 0; //The width of the scroll. 0 = beginning.
    var cycleTime = 5000; //Cycle time m/s.
    var _intervalId; //Cycle interval.

    /*
    	Create thumbnails from image elements.
     */
    images.each(function(index) {
        var image = $(this).find('img').get(0); //Get the img element.
        var src = $(image).attr('src'); //Get the src attribute.
        $(thumbnails).append('<div><img src="' + src + '" /></div>'); //Add div and img element to div.
    });

    /*
    	Set active thumbnail.
    */
    jQuery.fn.extend({
        setActive: function() {
            $(this).addClass('active'); //Add class active to this div.
        }
    });

    /*
    	Set inactive thumnail.
     */
    jQuery.fn.extend({
        setInactive: function() {
            $(this).removeClass('active'); //Remove active class from this div.
        }
    });

    //Set first thumbnail to active.
    var currentThumb = $(thumbnails).find('div').get(currentImage);
    $(currentThumb).setActive();

    /*
    	Clears current image displayed.
    */
    function clearCurrentImage() {
        //Hide current image.
        var current = $(images).get(currentImage);
        $(current).fadeOut().css('display', 'none'); //Hide with fade out.
        //Set thumbnail of current image inactive.
        var currentThumb = $(thumbnails).find('div').get(currentImage);
        $(currentThumb).setInactive();
    }

    /*
    	Display new image.
     */
    function displayImage(index) {
        //Show image
        var image = $(images).get(index);
        $(image).fadeIn().css('display', 'inline-block'); //Show with fade in.
        //Set thumbnail of image to active.
        var imageThumb = $(thumbnails).find('div').get(index);
        $(imageThumb).setActive();
    }

    /*
    	Calculate scroll width. Adds all previous image widths.
     */
    function getScrollWidth() {
        var width = 0;
        for (var i = 0; i < currentImage; i++) {
            var current = $(thumbnails).find('div').get(i);
            var image = $(current).find('img').get(0);
            width = width + $(image).width();
        }
        return width;
    }

    /*
    	Scroll to correct thumbnail.
     */
    function scrollThumbnails() {
        $(thumbnails).animate({
            scrollLeft: getScrollWidth()
        }, 1000);
    }

    /*
    	Cycle function. Variable for interval manager.
     */
    var imageCycle = function() {
        clearCurrentImage(); //Clear current displayed image
        nextImage = currentImage + 1; //Next image index.
        currentImage++; //Increment current image by 1. Do this before reset check.
        //Reset if last image.
        if (nextImage > images.length - 1) {
            nextImage = 0;
            currentImage = 0;
        }
        displayImage(nextImage); //Display new image.
        scrollThumbnails(); //Scroll to correct thumb.
    };

    /*
    	Interval manager for cycle.
     */
    function intervalManager(flag, animate, time) {
        if (flag)
            _intervalId = setInterval(animate, time);
        else
            clearInterval(_intervalId);
    }

    intervalManager(true, imageCycle, cycleTime); //Start interval.

    /*
    	Restarts the interval.
     */
    function resetInterval() {
        intervalManager(false); //Clear the interval.
        intervalManager(true, imageCycle, cycleTime); //Start the interval.
    }

    $(thumbnails).find("div").click(function() {
        clearCurrentImage(); //Clear current image from browser.
        currentImage = $(this).index(); //Set current image to clicked thumbnail index.
        displayImage(currentImage); //Display new current image.
        resetInterval(); //Restart the interval.
        scrollThumbnails(); //Scroll to correct thumb.
    });

});