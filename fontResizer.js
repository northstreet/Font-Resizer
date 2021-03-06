/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* ---------------------------------------------------------------------

FONT RESIZER, by North Street.  www.northstreetcreative.com
developed by Patrick Murray
Version 1.1
download and documentation available at https://github.com/northstreet/Font-Resizer

--------------------------------------------------------------------- */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */

(function ($) {
				
	$.fn.fontResizer = function ( options ) { 
		  var settings = $.extend( {
			target          : 'p',
			increaseCent 	: 20,
			exclude 		: '',
			resizedClass    : 'Aa-text',
			animate			: true,
			transform		: ''
		  }, options);
		  
		  var initialized = 0;
		  var clicked = 0; 
		  var $button = this;
		  var $userSelection = $(settings.target); 
		  typeof options == 'string' ? $userSelection = $(options) : false;
		  var counter = 0;
	  
		// Protect our Excludes from inherited sizing
			$(settings.exclude).each(function() {
				var mysize = $(this).css('font-size');
				$(this).css('font-size',mysize);
			});
		  
		  //Master List Holds the Elements to be Resized
			  resizeList = new Array();
			  
			  appendResizeList = function ($this) {
			  		resizeList.push($this);
			  };
	  
	  		// Determine if Node has Text, then get its Children
			getTheText = function (e) {
				e.each(function() {
					$this = $(this);
					// Exclude the excludes	
					if ($this.not(settings.exclude).length <= 0 ) {
						return false;
					}
					// Find the Text Nodes
					if ($.trim($this.clone().children().remove().end().text()).length > 0) { // From Viral Patel
						 // Add text nodes to our List and repeat
						 appendResizeList ( $this );
						 if ($this.children().length) { //Our Loop
							  $this.children().each(function () {
								  getTheText($(this));
							  });
						 }
					}
					else if ($this.children().length) { //Our Loop
							  $this.children().each(function () {
								  getTheText($(this));
							  });
					}
				});
			};
	  
		  getTheText($userSelection);
		  
	  // End INIT.  
	  
	  //Our Functions
	  
			  $button.click(function () { 
				  if(initialized == 0) {
					  // Do all the heavy lifting
							  recordFontData();
					  //only do this stuff once
					  initialized = 1;
				  }
				  else {
					  clickFunction();
				  }
			  });
		  
			//Record Font Data (only do this once)
			recordFontData = function ( ) {	
				for ( var i=0, len=resizeList.length; i<len; ++i  ){ 
					$this = resizeList[i]; 
					  var origSize =  parseInt( $this.css('font-size') ); 
					  var origHeight =  parseInt( $this.css('line-height') );
					  // New Font Size
					  var newSize = origSize + origSize * settings.increaseCent / 100;
					  // New Line Height (cross-browser solution)
					  origHeight < origSize ? newHeight = origSize + origSize * .7 : newHeight = origHeight + origHeight * settings.increaseCent/100;
					  var origStyle;
					  var animate;
					  settings.animate ? animate = '-webkit-transition: all 200ms linear; -moz-transition: all 200ms linear; transition: all 200ms linear;' : animate = '' ; 
					  if (typeof $this.attr('style') != 'undefined') {
						  origStyle = animate + $this.attr('style')  ;
					  }
					  else {
						  origStyle = animate + '' ;
					  };
					  $this.data('sizing', {
						  origStyle : origStyle,
						  origSize : origSize + 'px',
						  newSize : newSize + 'px',
						  newHeight : newHeight + 'px'
					  }); 
					  $this.addClass(settings.resizedClass);
				};
				clickFunction( );
			};
			
			//Click Functionality
			  clickFunction = function ( ) {				
				  if (clicked == 0) { 
					  for ( var i=0, len=resizeList.length; i<len; ++i  ){
						  $this = resizeList[i]; 
									$this.attr('style',$this.data('sizing').origStyle);
									$this.css('font-size', $this.data('sizing').newSize);
									$this.css('line-height', $this.data('sizing').newHeight);
									$this.css(settings.transform);
					  };
					  clicked = 1;
				  }
				  else {
					  for ( var i=0, len=resizeList.length; i<len; ++i  ){
						  $this = resizeList[i];
									var origStyle = $this.data('sizing').origStyle; 
									$this.attr('style',origStyle);
					  };
					  clicked = 0;
				  };
			  };	
		  return this;
	  };
				  
})(jQuery);