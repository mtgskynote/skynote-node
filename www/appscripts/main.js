
console.log("Yo, I am alive!");

// Grab the div where we will put our Raphael paper
let centerDiv = document.getElementById("centerDiv");

// Create the Raphael paper that we will use for drawing and creating graphical objects
let paper = new Raphael(centerDiv);

// put the width and heigth of the canvas into variables for our own convenience
let pWidth = paper.width;
let pHeight = paper.height;
console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);

// Just create a nice black background
let bgRect = paper.rect(0,0,pWidth, pHeight);
bgRect.attr({"fill": "black"});

//----------------------------------------------------------------
// Respond to the resize event to keep the raphael material snuggly in the div
window.addEventListener('resize', function(ev){
    let foo = document.getElementById("centerDiv");
    pWidth=foo.clientWidth;
    pHeight=foo.clientHeight
    paper.setSize(pWidth, pHeight);
    bgRect.attr({"width":pWidth, "height":pHeight})
    console.log("setSize .........  pWidth is " + pWidth + ", and pHeight is " + pHeight);
});

//============== INITIALIZE ARRAY OF DISKS  ===================//

// Create let to hold number of elements in your list
let numDisks=200;
let diskSize=4;
// Initialize array to empty
let disk = [];
let i=0;

let initx=-100; //pWidth/2;
let inity=-100; //pHeight/2;

while(i<numDisks){
    //disk[i]=paper.circle(pWidth/2, pHeight/2, diskSize);
    disk[i]=paper.circle(initx, inity, diskSize);

    disk[i].colorString = "hsl(" + Math.random()+ ",1, .75)";
    disk[i].attr({"fill": disk[i].colorString, "fill-opacity" : .75});

    // Add some properties to disk just to keep track of it's "state"
    disk[i].xpos=initx;
    disk[i].ypos=inity;
    // Add properties to keep track of the rate the disk is moving
    // 
    disk[i].xrate= -5+10*Math.random(); // in range [-5,5]
    disk[i].yrate= -7+14*Math.random(); // in range [-7,7]
    i++;
}


// Our drawing routine, will use as a callback for the interval timer
let draw = function(){

    let n=0;   // disk array index
    while(n<numDisks){

        // only update if they are on screen
        if (disk[n].xpos > -diskSize && disk[n].xpos < pWidth+diskSize){

            disk[n].yrate += gravity;

            disk[n].xpos += disk[n].xrate+wind;
            disk[n].ypos += disk[n].yrate;


            // Now actually move the disk on screen using our 'state' variables
            disk[n].attr({'cx': disk[n].xpos, 'cy': disk[n].ypos});

            // bounce 
           if (disk[n].ypos < 0      ) {
                disk[n].ypos=0
                disk[n].yrate = - .7*disk[n].yrate;
            }
           if (disk[n].ypos > pHeight) {
                disk[n].ypos=pHeight;
                disk[n].yrate = - .7*disk[n].yrate;
            }
       }
        n++;
    }
}

//-----------------------------------------------
let nextToEmit=0;
setInterval(function(){
    disk[nextToEmit].xpos=pWidth/2;
    disk[nextToEmit].ypos=pHeight/2;
    // assign6.6 Add properties to keep track of the rate the dot is moving
    //assign7: MAPPING of ranges (here, [0,1] -> [-5,5])
    disk[nextToEmit].xrate= -5+10*Math.random();
    disk[nextToEmit].yrate= -7+14*Math.random();

    nextToEmit=(nextToEmit+1) % numDisks;

},40);

let gravity = .5;
let wind = 0;

let aside=document.getElementById("aside");
console.log("aside is " + aside)

/*
       Must serve code from securely (from an https server) for sensors to work!!
*/

// This is for iOS users
document.getElementById("permissionButton").addEventListener("click", function(){
    if (window.DeviceOrientationEvent && window.DeviceOrientationEvent.requestPermission){
        window.DeviceOrientationEvent.requestPermission();
    }
});


if (window.DeviceOrientationEvent) {
//if ('ondeviceorientation' in window) {
    console.log("Hey: window.DeviceOrientationEvent is " + window.DeviceOrientationEvent);
    //aside.innerHTML="OK, we should get device orientation messages"
      // Listen for the event and handle DeviceOrientationEvent object
    window.addEventListener('deviceorientation', function(ev){
        //if ((ev.beta != null) && (! touching)){
        try{
            if (ev.beta != null){
                gravity= ev.beta/400;
                //aside.innerHTML = "gravity = " +  gravity;
            }
        } catch(ex){
            //aside.innerHTML=".....Device orientation is not supported"
        }

      }, false);
    } else{
        //aside.innerHTML="Device orientation is not supported"
        console.log("Device orientation not supported");
}

let center = document.getElementById("centerDiv")
aside.innerHTML="touch!"

// Touch for wind (swipe, really!)
let startX;

window.addEventListener("touchstart", function(ev){
    var touchobj = ev.changedTouches[0];
    startX = touchobj.pageX;
});

window.addEventListener("touchend", function(ev){
    var touchobj = ev.changedTouches[0];
    if (touchobj.pageX > startX) { // if there is a swipe to the right, blow disks to right side of screen
        wind += 1;
    } else { // if swipe left, remove wind effect
        wind -= 1; 
    };

});

// We do this last thing as the module loads
setInterval(draw, 40);

