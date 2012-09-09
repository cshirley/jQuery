/*
 * 
 * SmartTags 1.0 - Client-side smart tag creation
 * Version 0.1
 * @requires jQuery v1.2.3
 * 
 * Copyright (c) 2012 Clive Shirley
 * Examples and docs at: 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 */
jQuery.fn.addSmartTags = function(pattern, tagLinks) {
 
 var regex = typeof(pattern) === "string" ? new RegExp(pattern, "i") : pattern; // assume very LOOSELY pattern is regexp if not string
     
 function createActionLink(text, url) {
	 var link = document.createElement('a');
	 link.className = 'menuActionLink';
	 link.innerText = text;
	 link.setAttribute('data-url', url);
		 
	 return link;
 }
 
 function createActionMenu(text, tagLinks) {

	 var ulRoot = document.createElement('ul');	 
	 var liRoot = document.createElement('li');
	 var ulLinks = document.createElement('ul');		 
	 var tagCount = tagLinks.length;
	 
	 for(i=0;i<tagCount;i++) {
		
		 var tagLink = tagLinks[i];
		 var liLinkStock = document.createElement('li');		 
		
		 liLinkStock.appendChild(createActionLink(tagLink.description.replace('{params}',text.textContent), 
			 					tagLink.url.replace('{params}', 
								text.textContent.replace(/[\$|#]/, ''))));
		 ulLinks.appendChild(liLinkStock);
			 
	 }; 
	 
	 liRoot.appendChild(text);
	 liRoot.appendChild(ulLinks);
	 ulRoot.appendChild(liRoot);
	 ulRoot.className='smartTagMenu';

	 return ulRoot;
 };
	 
 function innerHighlight(node, pattern, tagLinks) {
        var skip = 0;
        if (node.nodeType === 3) { // 3 - Text node
            var pos = node.data.search(regex);
            if (pos >= 0 && node.data.length > 0) { // .* matching "" causes infinite loop
                var match = node.data.match(regex); // get the match(es), but we would only handle the 1st one, hence /g is not recommended
                var spanNode = document.createElement('span');				 				 				 
                spanNode.className = 'smartTag'; // set css
                var middleBit = node.splitText(pos); // split to 2 nodes, node contains the pre-pos text, middleBit has the post-pos
                var endBit = middleBit.splitText(match[0].length); // similarly split middleBit to 2 nodes
                var middleClone = middleBit.cloneNode(true);

                //spanNode.appendChild(middleClone);
			 spanNode.appendChild(createActionMenu(middleClone, tagLinks));
                // parentNode ie. node, now has 3 nodes by 2 splitText()s, replace the middle with the highlighted spanNode:
                middleBit.parentNode.replaceChild(spanNode, middleBit); 
                skip = 1; // skip this middleBit, but still need to check endBit
            }
        } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) { // 1 - Element node
            for (var i = 0; i < node.childNodes.length; i++) { // highlight all children
                i += innerHighlight(node.childNodes[i], pattern, tagLinks); // skip highlighted ones
            }
        }
        return skip;
    }
	 
	 
    
    return this.each(function() {
        innerHighlight(this, pattern, tagLinks);
    });
};

jQuery.fn.removeSmartTags = function() {
    return this.find("span.smartTag").each(function() {
        this.parentNode.firstChild.nodeName;
        with (this.parentNode) {
            replaceChild(this.firstChild, this);
            normalize();
        }
    }).end();
};       