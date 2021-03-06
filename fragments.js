var rnf = {
            "syn"      : [['def',';','syn'],['def']],
            "def"      : [['syncat','=','altlist']],
            "altlist"  : [['termlist','|','altlist'],['termlist']],
            "termlist" : [['termlist','term'],['term']],
            "term"     : [['syncat'],['lit']],  
            "syncat"   : [['<','\w+','>']],
            "lit"      : [['"','.+','"']]
          }

function parsergen(syntab)
  var p;
  p.syn = {};  
  p.str = '';
  p.pos = 0;
 
  for (var category in syntab){
    if (syntab.hasOwnProperty(category)) {
                                  
      p.syn[category] =
      (function (cat){
        return
        function () {
          var progress = 0,
              alt   = 0,
              def   = syntab[cat],
              stack = [def[alt][0]()],
              alts  = def.length,
              completed = def[0].length;
          return {
            "check" : 
            function () {
              while (true) {
                if (stack[progress].check()) {
                  if (progress === completed) {
                    return(true);
                  } else {
                    stack[++progress] = def[alt][progress]();
                  }
                } else {
                  if (progress === 0) {
                    if (++alt<alts) {
                       completed = def[alt].length;
                       stack[0]  = def[alt][0]();
                    } else {
                      return(false);
                    }
                  } else {
                     progress--;
                  }
                }
              }
            },
          "report" :
            function () { 


            }
          }
        }
      })(category);
    }
  }

  for (var category in syntab){
    if (syntab.hasOwnProperty(category)) {
      var alts = syntab[category].length;
      for (var alt=0;alt<alts;alt++) {
        var completed = syntab[category][alt].length;
        for (var progress=0;progress<completed;progress++) {
          var txt = syntab[category][alt][progress];
          if (exists(syn.hasOwnProperty(txt))) {
            syntab[category][alt][progress] = p.syn[txt];
          }
          else
          {
            syntab[category][alt][progress]={
            "check" :
              function () {
                var fresh = true
                    pat = new RegExp('\s*?'.txt),
                    result,
                    n=0;
                return
                  function () {
                    if (fresh) {
                      fresh = false;
                      result = pat.exec(p.str.substr(p.pos));
                      if ($result !== null) {
                        result += '';
                        n = result.length; 
                        p.pos += n;
                        return true;
                     } 
                   }
                   p.pos -= n;
                   return(fresh);                                                              
                }
              },
            "report" :
              function () { 


              }
            }
          }
        }
      }
    }
  }

  return(p);
}

function execute_child(xmlNode, htmlSpots, code) {
  var tag = xmlnode.tagName,
      weave = {'htmlSpots':null,'htmlTree':null};

  if (tag !== undefined) {
    if (code.hasOwnProperty(tag) && htmlSpots.hasOwnProperty(tag)) {

      var fragNode = document.getElementById('fragment').querySelector(tag).cloneNode(true),
          weave    = seam(xmlNode,fragNode,weave);
          htmlTree = weave.htmlTree;

      htmlSpots[tag].parentNode.replaceChild(htmlTree,htmlSpotNode);
      code[tag](xmlNode,htmlTree);
    }
    execute_children(xmlNode, weave , code);
  }
}

function seam(xmlNode,fragNode,weave){
  var chi = fragnode.childNodes;

  for (var i=0; i<chi.length; i++) {
    if (chi[i].tagName) {
      if (chi[i].className !== 'rnf')
        weave = seam(xmlNode,chi[i],weave));
      else {
        var prm = chi[i].dataset;

        if (prm.type = 'spot') {
          weave.htmlSpots[prm.hook] = chi[i];
        } else if (prm.type = 'aa') {
          fragNode.setAttribute(prm.ato,xmlNode.querySelector(prm.query).getAttribute(prm.afrom));
          fragNode.removeChild();
        } else if (prm.type = 'at') {
          fragNode.replaceChild(document.createTextNode(xmlNode.querySelector(prm.query).getAttribute(prm.afrom)),chi[i]);
        } else if (prm.type = 'ta') {
          fragNode.setAttribute(prm.ato,xmlNode.querySelector(prm.query).childNode.nodeValue());
          fragNode.removeChild();
        } else if (prm.type = 'tt') { 
          fragNode.replaceChild(document.createTextNode(xmlNode.querySelector(prm.query).childNode.nodeValue()),chi[i]);
        }
      }
    }
  } 

  return(weave);
}

function execute_children(xmlNode, htmlSpots, code) {
  var xmlChildNode = xmlNode.firstChild;
  while (xmlChildNode !== undefined) {
    execute_child(xmlChildNode, htmlSpots, code);
  }

  cleanUp(htmlSpots);
}

function cleanUp(htmlSpots) {
  for (var tag in htmlSpots) {
    if (htmlSpots.hasOwnProperty(tag)) {
      htmlSpots[tag].parentNode.removeChild(htmlSpots[tag]);
    }
  }
}
