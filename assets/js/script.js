var menuStylesheet=null;

document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelectorAll('[page-name=index]').length > 0){
    reposition(calculateMenuPositions());
    window.addEventListener('resize', function(){
      reposition(calculateMenuPositions());
    })
  }

});

function reposition(coords){
  jss.remove();
  jss.set("#home-page>a", {
    "top": coords.logo.t+"px",
    "left": coords.logo.l+"px",
    "width": coords.logo.w+"px",
    "height": coords.logo.h+"px"
  });
  for (var group in coords.groups) {
    for (var link in coords.groups[group]){
      jss.set("#"+link+">a", {
        "top": coords.groups[group][link].t+"px",
        "left": coords.groups[group][link].l+"px",
        "width": coords.groups[group][link].w+"px",
        "height": coords.groups[group][link].h+"px"
      });
    }
  }
}

function calculateMenuPositions(){
  console.log("calculatingMenuPositions");
  var coords={
    logo: {},
    groups: {}
  };
  var height=document.querySelector("body").offsetHeight;var lh=height;
  var width=document.querySelector("body").offsetWidth;var lw=width;
  if (width<height){
    lh=lw=width/3.5;
  } else {
    lw=lh=height/3.5;
  }
  var ll=(width-lw)/2;
  var lt=(height-lh)/2;
  coords.logo=cartesianSpace(ll, lt, lw, lh);

  var groups=document.querySelectorAll("main .navigation-menu.group");
  var mainStartAngle=Math.PI/12;
  var delta=2*Math.PI/groups.length;
  var radius=lw*1.2;
  var center={t: height/2, l: width/2};
  var reductionFactor=0.65;
  var step=reductionFactor*1.05;
  groups.forEach(function(group, i, groups){
    coords.groups[group.getAttribute("Id")]={};
    mainStartAngle=mainStartAngle+delta*i;
    var links=group.querySelectorAll(".nav-link.l1");
    var linkStartAngle=mainStartAngle+step*(links.length-1)/2;
    links.forEach(function(link, j, links){
      var linkAngle=linkStartAngle-step*j;
      var space=cartesianSpace(0,0,0,0);
      space.w=lw*reductionFactor;
      space.h=lh*reductionFactor;
      space.l=center.l+radius*Math.cos(linkAngle)-space.w/2;
      space.t=center.t-radius*Math.sin(linkAngle)-space.h/2;
      coords.groups[group.getAttribute("Id")][link.getAttribute("Id")]=space;
    });

  });

  console.log(coords);
  return coords;

}

function cartesianSpace(left, top, width, height){
  return {
    l: left,
    t: top,
    w: width,
    h: height
  };
}
