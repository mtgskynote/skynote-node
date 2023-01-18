
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
let numDisks=20;
let diskSize=20;
// Initialize array to empty
let disk = [];
let i=0;

let initx=pWidth/2;
let inity=pHeight/2;

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

//======== DRAW FUNCTION, called by an interval time  =============//

// Our drawing routine, will use as a callback for the interval timer
let draw = function(){

    let n=0;   // disk array index
    while(n<numDisks){


        disk[n].xpos += disk[n].xrate;
        disk[n].ypos += disk[n].yrate;


        // Now actually move the disk on screen using our 'state' variables
        disk[n].attr({'cx': disk[n].xpos, 'cy': disk[n].ypos});

        // bounce 

        n++;
    }
}

//-----------------------------------------------


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


let center = document.getElementById("centerDiv")
aside.innerHTML="touch!"

// Touch for wind (swipe, really!)
let startX;


// We do this last thing as the module loads
setInterval(draw, 40);

