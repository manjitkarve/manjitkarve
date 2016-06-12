var menuStylesheet=null;

document.addEventListener('DOMContentLoaded', function () {
  updateLevels();
  reposition(calculateMenuPositions());
  window.addEventListener('resize', function(){
    reposition(calculateMenuPositions());
  });


});

function reposition(coords){
  jss.remove();

  jss.set(".flared #home-page>a", {
    "top": coords.logo.t+"px",
    "left": coords.logo.l+"px",
    "width": coords.logo.w+"px",
    "height": coords.logo.h+"px"
  });
  /*jss.set("#home-page", {
    "top": coords.logo.t+"px",
    "left": coords.logo.l+"px",
    "width": coords.logo.w+"px",
    "height": coords.logo.h+"px"
  });*/
  for (var group in coords.groups) {
    for (var link in coords.groups[group]){
      jss.set(".flared #"+link, {
        "top": coords.groups[group][link].space.t+"px",
        "left": coords.groups[group][link].space.l+"px",
        "width": coords.groups[group][link].space.w+"px",
        "height": coords.groups[group][link].space.h+"px"
      });
      if (coords.groups[group][link].title){
        jss.set(".flared #"+link+">a .text", {
          "top": coords.groups[group][link].title.t+"px",
          "left": coords.groups[group][link].title.l+"px"
        });
      }
      if (coords.groups[group][link].submenu){
        jss.set(".flared #"+link+">a+.submenu", {
          "top": coords.groups[group][link].submenu.t+"px",
          "left": coords.groups[group][link].submenu.l+"px"
        });
      }
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

  var groups=document.querySelectorAll("nav .navigation-menu.group");
  var mainStartAngle=Math.PI/12;
  var delta=2*Math.PI/groups.length;
  var distanceIncrement=1.1;
  var l1Radius=lw*distanceIncrement;
  var l2Radius=l1Radius*distanceIncrement;
  var center={t: height/2, l: width/2};
  var reductionFactor=0.6;
  var step=reductionFactor*1.05;
  groups.forEach(function(group, i, groups){
    coords.groups[group.getAttribute("Id")]={};
    mainStartAngle=mainStartAngle+delta*i;
    var links=group.querySelectorAll(".nav-link-list-item.l1");
    var linkStartAngle=mainStartAngle+step*(links.length-1)/2;
    links.forEach(function(link, j, links){
      var linkAngle=linkStartAngle-step*j;
      var space=cartesianSpace(0,0,0,0);
      var linkCenter={
        l: center.l+l1Radius*Math.cos(linkAngle),
        t: center.t-l1Radius*Math.sin(linkAngle)
      }
      space.w=lw*reductionFactor;
      space.h=lh*reductionFactor;
      space.l=linkCenter.l-space.w/2;
      space.t=linkCenter.t-space.h/2;
      coords.groups[group.getAttribute("Id")][link.getAttribute("Id")]={
        "space":space
      };
      l2Radius=space.w/2*distanceIncrement;
      var title=children(link, ".nav-link")[0].querySelector(".text");
      var titleSpace=null;
      if (title){
        var quadrant=getQuadrant(linkAngle);
        titleSpace=cartesianSpace();
        titleSpace.l = l2Radius*Math.cos(linkAngle);
        titleSpace.t = -l2Radius*Math.sin(linkAngle);
        titleSpace.w=title.offsetWidth;
        titleSpace.h=title.offsetHeight;
        switch (quadrant) {
          case 1:
            titleSpace.t+=-title.offsetHeight+space.h/2;
            titleSpace.l+=space.w/2
            break;
          case 2:
            titleSpace.t+=space.h/2-title.offsetHeight;
            titleSpace.l+=space.w/2-title.offsetWidth;
            break;
          case 3:
            titleSpace.l+=space.w/2-title.offsetWidth;
            titleSpace.t+=space.h/2;
            break;
          case 4:
            titleSpace.l+=space.w/2;
            titleSpace.t+=space.h/2;
        }
        coords.groups[group.getAttribute("Id")][link.getAttribute("Id")].title=titleSpace;
      }
      var submenu = children(link, ".submenu");
      if (submenu.length > 0){submenu=submenu[0]} else {submenu=null;}
      var submenuSpace=null;
      if (submenu) {
        submenuSpace=cartesianSpace(0,0,0,0);
        submenuSpace.l=titleSpace.l;
        submenuSpace.t=titleSpace.t+titleSpace.h;
        coords.groups[group.getAttribute("Id")][link.getAttribute("Id")].submenu=submenuSpace;
      }

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

//return 1st quadrant to 4th quadrant as 1 to 4
function getQuadrant(angle){
  while(angle<0){
    angle+=Math.PI*2;
  }
  return Math.floor(angle/(Math.PI/2))+1;
}

function children(el, selector){
  var descendents=el.querySelectorAll(selector);
  var children=[];
  if (descendents){
    for (i in descendents){
      var child=descendents[i];
      if (child.parentNode === el){
        children.push(child);
      }
    }
  }
  return children;
}

function updateLevels(ul, level){
  var prefix="l";
  if (level === null || typeof level === "undefined"){
    level=0;
  }
  if (ul==null || typeof ul === "undefined"){
    ul=document.querySelector('nav ul.navigation-menu');
  }
  if (ul!==null && typeof ul !== "undefined"){
    ul.classList.add(prefix+level);
    var lis=children(ul, "li.nav-link-list-item");
    for(var i = 0; i<lis.length; i++){
      var li=lis[i];
      li.classList.add(prefix+level);
      var uls=children(li, "ul");
      for (var j=0; j<uls.length; j++){
        updateLevels(uls[j], level+1);
      }
    }
  }
}
