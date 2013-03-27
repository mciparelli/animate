
# animate

  component for handling CSS3 animations easily with Javascript

## Installation

    $ Component install mciparelli/animate

## example

	
	var Animate = require('animate');
	var animate = Animate('p');
	animate
	.set('bg-keyframe', '3s')
	.start();
	animate.on('animationEnd', function startANewOne(){
		animate
		.set('fg-keyframe', '5s infinite alternate')
		.start();
	});

## License

  MIT
