


 What is getBoundingClientRect()? 
 link=https://youtube.com/shorts/VoPoqDG-s2Q?si=RKuHFq_JGoD5oprq 
getBoundingClientRect() is a JavaScript method that gives the position and size of an HTML element relative to the viewport (complete visible area of the screen ). --> 

It gives an object with these common properties:

Property	Meaning
x / left	Distance from the left edge of the viewport
y / top	Distance from the top edge of the viewport
right	Distance from the left edge to the right edge of the element
bottom	Distance from the top edge to the bottom edge of the element
width	Width of the element
height	Height of the element

e.target.getBoundingClientRect() it give the total width of the seekbar 
document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100+"%"; 
in above offsetx se x cordinate mil gya aur getboundingClientRect.width se total width according to the viewport   
jha pe click kiye uska % ki pura width ka kitan % pe click kiye hai wha tak circle ko move kr diye bas  