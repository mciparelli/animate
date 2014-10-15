
# animate

  Use CSS3 animations easily with Javascript. Library inspired by [move.js](https://github.com/visionmedia/move.js)

## Installation

    $ npm install animatejs

or to use directly in the browser:

    $ bower install animatejs

This library is written in ES6, checkout `Gruntfile.js` for an example on how to build it, or just use a tool like [6to5](https://github.com/sebmck/6to5) to compile to ES5 and use it in node.

An already built version is included in `dist/` directory. If loaded in a browser it will set an `animate` global variable.

## example

```javascript
animate()
.kf({
  '25%, 75%': {
    background: 'orange'
  },
  100: {
    background: 'red'
  }
})
.kf({
  // specify a name to the keyframe. Defaults to 'keyframe-{n}'.
  // n - number of keyframes defined in animate library
  name: 'bounce',
  50: {
    'margin-left': '500px'
  }
})
// animate().query(selector) being a long version for animate(selector).
// You can define keyframes using .kf before or after matching elements
// since they are not related to the DOM element you attach but to the document.
// Every time you call this method it will override previous matched elements
.query('.random-class')
// assign the 'keyframe-0' animation to '.random-class'
// and make it last 2 iterations of 1 second long each.
// Just assignment, doesn't play yet
.set('keyframe-0 1s 2')
// do something on each iteration
.on('AnimationIteration', function (animate) {
  console.log('argument is the animate instance we were using', animate);
})
// ok! now let's play the assigned animations in '.random-class'
.play()
// do something once animation ends.
// The argument is the same instance we were using,
// so you can chain other animations on the same element
.then(function (animate) {
  return animate
    // assign 'bounce' animation and make it last 4 iterations of 2 seconds long
    .set('bounce 2s 4')
    // additionally assign 'keyframe-0' animation and
    // make it last 10 iterations of 1 second long
    .set({
      name: 'keyframe-0',
      duration: '1s',
      'iterationCount': 10
    })
    // play them
    .play();
})
// do something once both animations ended
.then(function (animate) {
  console.log('finished animating everything');
})
```

## docs

```javascript
// initializes animate, you can optionally pass it a selector
// to start assigning animations to the attached element right away
animate(selector) {}

// do something on events like 'AnimationIteration' or 'AnimationStart'.
// You shouldn't use 'AnimationEnd', use `play().then` instead.
on(eventType, listener) {}

// remove event listener
off(eventType) {}

// assign a keyframe, refer to example
kf(kf) {}, keyframe(kf) {}, setKeyframe(kf) {}

// assign animation properties into attached element.
// Each argument must be a string or an animation object (refer to example)
set(...animationRules) {}

// attach a DOM element, this method is called on init.
query(selector) {}

// reset animations on attached elements
reset() {}

// generate a new clean CSS sheet where to hold keyframes and calls .reset()
clean() {}

// pause current animation
pause() {}

// resume previously paused animation
resume()

// play assigned animations.
// Returns a promise that resolves once all assigned animations ended
play()

```
