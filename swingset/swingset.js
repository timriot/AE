function getElementByClass (className, parent) {
  parent || (parent = document);
  var descendants= parent.getElementsByTagName('*'), i=-1, e, result=[];
  while (e=descendants[++i]) {
    ((' '+(e['class']||e.className)+' ').indexOf(' '+className+' ') > -1) && result.push(e);
  }
  return result;
}

var coachmark = getElementByClass("coachmark");


coachmark.onclick= function() {
    // this adds the 'active' class to the classes that the element already has
    coachmark.className = coachmark.className + ' hidden';
};