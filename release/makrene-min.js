!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.Makrene=e()}}(function(){return function e(t,r,n){function i(s,c){if(!r[s]){if(!t[s]){var o="function"==typeof require&&require;if(!c&&o)return o(s,!0);if(a)return a(s,!0);throw new Error("Cannot find module '"+s+"'")}var u=r[s]={exports:{}};t[s][0].call(u.exports,function(e){var r=t[s][1][e];return i(r?r:e)},u,u.exports,e,t,r,n)}return r[s].exports}for(var a="function"==typeof require&&require,s=0;s<n.length;s++)i(n[s]);return i}({1:[function(e,t,r){var n={version:"0.1.0",Vertex:function i(e){var t=Object.create(i.prototype,{});return Object.assign(t,{edges:[],faces:[],neighbours:[],data:e||{}})},isVertex:function(e){return"undefined"!=typeof e&&e instanceof n.Vertex},Edge:function a(e){var t=Object.create(a.prototype,{});return Object.assign(t,{vertices:[],faces:[],neighbours:[],data:e||{}})},isEdge:function(e){return"undefined"!=typeof e&&e instanceof n.Edge},Face:function s(e){var t=Object.create(s.prototype,{});return Object.assign(t,{vertices:[],edges:[],neighbours:[],data:e||{}})},isFace:function(e){return"undefined"!=typeof e&&e instanceof n.Face},Graph:function c(e){var t=Object.create(c.prototype,{});return Object.assign(t,{_onChangeCallbacks:[],vertices:[],edges:[],faces:[],neighbours:[],data:e||{},addVertex:function(e){return t.vertices.push(e),t.emitChange({action:"addVertex",graph:t,newObject:e}),t},addEdge:function(e){return t.edges.push(e),t.emitChange({action:"addEdge",graph:t,newObject:e}),t},addFace:function(e){return t.faces.push(e),t.emitChange({action:"addFace",graph:t,newObject:e}),t},forEach:function(e){t.vertices.forEach(e)},onChange:function(e){t._onChangeCallbacks.push(e)},emitChange:function(e){t._onChangeCallbacks.forEach(function(t){t(e)})}})},isGraph:function(e){return"undefined"!=typeof e&&e instanceof n.Graph}};t.exports=n},{}],2:[function(e,t,r){e("../vendorJs/polyfill"),t.exports=Object.assign(e("./base/makrene.base"),{Circle:e("./graph/makrene.graph.circle"),Grid:e("./graph/makrene.graph.grid"),Ki:{Circle:e("./ki/makrene.ki.circle")},Search:e("./search/makrene.search"),Visualizer:Object.assign(e("./visualizer/makrene.visualizer"),{Grid:e("./visualizer/makrene.visualizer.grid"),Circle:e("./visualizer/makrene.visualizer.circle"),CircleFullscreen:e("./visualizer/makrene.visualizer.circleFullscreen")})})},{"../vendorJs/polyfill":11,"./base/makrene.base":1,"./graph/makrene.graph.circle":3,"./graph/makrene.graph.grid":4,"./ki/makrene.ki.circle":5,"./search/makrene.search":6,"./visualizer/makrene.visualizer":10,"./visualizer/makrene.visualizer.circle":7,"./visualizer/makrene.visualizer.circleFullscreen":8,"./visualizer/makrene.visualizer.grid":9}],3:[function(e,t,r){!function(){function r(e,t,r){return 0===r?0:(r-1)*e.numVertexOnLevel+t+1}function n(e,t){return 0==t?{level:0,position:0}:{level:Math.floor(t/e.numVertexOnLevel)+1,position:Math.floor(t%e.numVertexOnLevel)-1}}function i(e,t,r){var n=e.vertices[t-1];if(n){var i=e.vertices[t][r],a=n.length-1<r?0:r,s=n.length-1<r+1?0:r+1;n[a]&&(i.neighbours.push(n[a]),n[a].neighbours.push(i),c(e,i,n[a])),a!=s&&n[s]&&(i.neighbours.push(n[s]),n[s].neighbours.push(i),c(e,i,n[s]),n[a]&&u(e,i,n[a],n[s]))}}function a(e,t,r){var n=e.vertices[t+1];if(n){var i=e.vertices[t][r],a=r,s=r-1<0?e.numVertexOnLevel-1:r-1;n[a]&&(i.neighbours.push(n[a]),n[a].neighbours.push(i),c(e,i,n[a])),a!=s&&n[s]&&(i.neighbours.push(n[s]),n[s].neighbours.push(i),c(e,i,n[s]),n[a]&&u(e,i,n[a],n[s]))}}function s(e,t,r){r&&(t.neighbours.push(r),r.neighbours.push(t),c(e,t,r),t.neighbours.filter(function(e){if(r!=e)return r.neighbours.includes(e)}).forEach(function(n){u(e,t,r,n)}))}function c(e,t,r){var n=l.Edge();n.vertices.push(t),n.vertices.push(r),n.id=e.edges.length,e.edges.push(n),r.edges.push(n),t.edges.push(n),o(n,t),o(n,r)}function o(e,t){t.edges.forEach(function(t){e==t||e.neighbours.includes(t)||(e.neighbours.push(t),t.neighbours.push(e))})}function u(e,t,r,n){var i=l.Face();i.vertices.push(t),i.vertices.push(r),i.vertices.push(n),t.faces.push(i),r.faces.push(i),n.faces.push(i),i.id=e.faces.length,i.data={level:Math.max(t.data.level,r.data.level,n.data.level)},e.faces.push(i),f(i,t),f(i,r),f(i,n);var a=[];a.push(t.edges.filter(function(e){return e.vertices.includes(r)}).first()),a.push(r.edges.filter(function(e){return e.vertices.includes(n)}).first()),a.push(n.edges.filter(function(e){return e.vertices.includes(t)}).first()),a.forEach(function(e){e.faces.push(i),i.edges.push(e)})}function f(e,t){t.faces.forEach(function(t){e==t||e.neighbours.includes(t)||(e.neighbours.push(t),t.neighbours.push(e))})}function h(e,t,r){var n=360/e.numVertexOnLevel/2;return n+n*t+360/e.numVertexOnLevel*r}var l=e("../base/makrene.base");t.exports=function d(e){e=Object.assign({numVertexOnLevel:8},e);var t=0,c=0,o=Object.create(d.prototype,{numVertexOnLevel:{value:e.numVertexOnLevel},numCircleLevels:{get:function(){return t}},length:{get:function(){return c}},isEmpty:{get:function(){return 0===o.vertices.length}},first:{get:function(){return o.vertices[0]?o.vertices[0][0]:void 0}},center:{get:function(){return o.first}},last:{get:function(){return o.isEmpty?void 0:1===o.length?o.center:o.vertices[t][o.vertices[t].length-1]}}});return Object.assign(o,l.Graph(),{push:function(){return[].forEach.call(arguments,function(e){"undefined"!=typeof e&&e instanceof l.Vertex||(e=l.Vertex(e||{})),o.isEmpty||0!=t&&o.vertices[t].length!==o.numVertexOnLevel||t++,o.vertices[t]=o.vertices[t]||[],o.addVertexAt(t,o.vertices[t].length,e),o.emitChange({action:"push",graph:o,newObject:e})}),o.length},pop:function(){var e=o.removeVertex(o.last);return o.emitChange({action:"pop",graph:o,removedObject:e}),e},shift:function(){var e;if(!o.isEmpty){if(1===o.length)e=o.last,o.removeVertex(o.last);else{for(var t=[],r=o.vertices.length-1;r>=0;r--)t[r]=o.vertices[r][0],o.removeVertex(o.vertices[r][0]);for(var n=o.vertices.length-1;n>=0;n--)o.vertices[n].shift(),o.vertices[n].forEach(function(e,t){e&&(e.data.degree=h(o,n,t),e.data.level=n,e.id=e.data.level+"_"+e.data.degree)});c--,o.addVertexAt(0,0,t[1]);for(var i=t.length-1;i>=2;i--)o.addVertexAt(i-1,o.numVertexOnLevel-1,t[i]);e=t[0]}return o.emitChange({action:"shift",graph:o,removedObject:e}),e}},unshift:function(){return[].forEach.call(arguments,function(e){if("undefined"!=typeof e&&e instanceof l.Vertex||(e=l.Vertex(e||{})),o.isEmpty)o.addVertexAt(0,0,e),c=1;else{var r=o.length,n=[o.center];o.removeVertex(o.center);for(var i=o.vertices.length-1;i>=0;i--)o.vertices[i][o.numVertexOnLevel-1]&&(n[i]=o.vertices[i][o.numVertexOnLevel-1],o.removeVertex(o.vertices[i][o.numVertexOnLevel-1]));for(var a=o.vertices.length-1;a>=0;a--)o.vertices[a].unshift(void 0),o.vertices[a].forEach(function(e,t){e&&(e.data.degree=h(o,a,t),e.data.level=a,e.id=e.data.level+"_"+e.data.degree)});c=r;for(var s=n.length-1;s>=0;s--)o.addVertexAt(s+1,0,n[s]);o.addVertexAt(0,0,e),o.isEmpty||0!=t&&o.vertices[t].length!==o.numVertexOnLevel||t++}o.emitChange({action:"unshift",graph:o,newObject:e})}),o.length},fill:function(e,t,r){for("undefined"!=typeof e&&e instanceof l.Vertex||(e=l.Vertex(e||{})),t=t||0,t=t<0?Math.max(o.length+t,0):Math.min(t,o.length),r=r||o.length,r=r<0?Math.max(o.length+r,0):Math.min(r,o.length);t<r;){var i=n(o,t);o.addVertexAt(i.level,i.position,e),t++}return o},expandFromOudside:function(e){for(e=e||o.numVertexOnLevel;e>0;e--)o.push(l.Vertex());return o.length},expandFromInside:function(e){for(e=e||o.numVertexOnLevel;e>0;e--)o.unshift(l.Vertex());return o.length},collapseFromOudside:function(e){var t=[];for(e=e||o.numVertexOnLevel;e>0;e--)t.push(o.pop());return t},collapseFromInside:function(e){var t=[];for(e=e||o.numVertexOnLevel;e>0;e--)t.push(o.shift());return t},clear:function(){t=0,c=0,o.faces=[],o.edges=[],o.vertices=[],o.neighbours=[],o.data={}},includes:function(e){return o.filter(function(t){return t===e}).length>0},vertexAt:function(e,t){return o.vertices[e]?o.vertices[e][t]:void 0},facesAt:function(e){return o.faces.filter(function(t){return t.data.level==e})},getFacesLevelArray:function(){var e=[];return o.faces.forEach(function(t){"undefined"==typeof e[t.data.level]&&(e[t.data.level]=[]),e[t.data.level].push(t)}),e},indexOf:function(e){for(var t=0,r=o.vertices.length-1,n=0;r>=0;r--,n++){var i=o.vertices[n].indexOf(e);if(i>=0)return t+i;t+=o.vertices[n].length}return-1},addVertexAt:function(e,t,n){if(0!=o.numVertexOnLevel&&!(o.numVertexOnLevel<t||0==o.level&&0!==t)){o.vertices[e]=o.vertices[e]||[],"undefined"==typeof n?o.vertices[e][t]=void 0:(n.data.degree=h(o,e,t),n.data.level=e,n.id=n.data.level+"_"+n.data.degree,o.vertices[e][t]=n,0===e?o.vertices[1]&&o.vertices[1].forEach(function(e,t){o.removeVertex(e),o.addVertexAt(1,t,e)}):(i(o,e,t),a(o,e,t),s(o,n,o.vertices[e][(t-1+o.numVertexOnLevel)%o.numVertexOnLevel]),s(o,n,o.vertices[e][(t+1+o.numVertexOnLevel)%o.numVertexOnLevel])));var u=r(o,t,e);u>o.length-1&&(c=u+1)}},removeVertexFrom:function(e,t){return o.removeVertex(o.vertexAt(e,t))},removeVertex:function(e){if(e){e.neighbours.forEach(function(t){t.neighbours.splice(t.neighbours.indexOf(e),1)}),e.edges.forEach(function(t){t.neighbours.forEach(function(e){e.neighbours.splice(e.neighbours.indexOf(t),1)}),t.vertices.forEach(function(r){r!=e&&r.edges.splice(r.edges.indexOf(t),1)}),t.faces.forEach(function(e){e.edges.splice(e.edges.indexOf(t),1)}),o.edges.splice(o.edges.indexOf(t),1)}),e.faces.forEach(function(t){t.neighbours.forEach(function(e){e.neighbours.splice(e.neighbours.indexOf(t),1)}),t.vertices.forEach(function(r){r!=e&&r.faces.splice(r.faces.indexOf(t),1)}),t.edges.forEach(function(e){e.faces.splice(e.faces.indexOf(t),1)}),o.faces.splice(o.faces.indexOf(t),1)});var n=0;return o.vertices.forEach(function(i,a){i.includes(e)&&(n=r(o,i.indexOf(e),a),i.indexOf(e)==i.length-1?i.length=i.length-1:delete i[i.indexOf(e)],t==a&&0===i.length&&(0===o.numCircleLevels?o.vertices=[]:(t--,o.vertices.splice(o.vertices.indexOf(i),1))))}),e.edges=[],e.faces=[],e.neighbours=[],n==c-1&&c--,e}},forEach:function(e){o.vertices.forEach(function(t,n){t.forEach(function(t,i){e(t,r(o,i,n),o)})})},filter:function(e){var t=[];return o.forEach(function(r,n){e(r,n,o)&&t.push(r)}),t},map:function(e){var t=[];return o.forEach(function(r,n){t.push(e(r,n,o))}),t},toString:function(){return"Makrene.Circle\n\tNumVertexOnLevel: "+o.numVertexOnLevel+"\n\tNumCircleLevels: "+o.numCircleLevels+"\n\tLength: "+o.length+"\n\tEdges: "+o.edges.length+"\n\tFaces: "+o.faces.length}})}}()},{"../base/makrene.base":1}],4:[function(e,t,r){var n=e("../base/makrene.base"),i={Top:0,Right:1,Bottom:2,Left:3,TopLeft:0,TopRight:1,BottomRight:2,BottomLeft:3};t.exports=function(e){e=e||{};var t=Object.assign(n.Graph(),{rows:e.rows||0,cols:e.cols||0,init:function(){t.createVertexes(),t.linkVertexes(),t.createEdges(),t.linkEdges(),t.createFaces(),t.linkFaces()},createVertexes:function(){for(var e=t.rows-1;e>=0;e--){t.vertices[e]=[];for(var r=t.cols-1;r>=0;r--){var i=n.Vertex();i.data.row=e,i.data.col=r,t.vertices[e][r]=i}}},linkVertexes:function(){t.forEach(function(e,r,n){n>0&&(e.neighbours[i.Left]=t.vertices[r][n-1]),n<t.cols-1&&(e.neighbours[i.Right]=t.vertices[r][n+1]),r>0&&(e.neighbours[i.Top]=t.vertices[r-1][n]),r<t.rows-1&&(e.neighbours[i.Bottom]=t.vertices[r+1][n])})},createEdge:function(e,r){var i=n.Edge();i.vertices.push(e),i.vertices.push(r),t.edges.push(i),r.edges.push(i),e.edges.push(i)},createEdges:function(){t.forEach(function(e){e.neighbours[i.Left]&&t.createEdge(e,e.neighbours[i.Left]),e.neighbours[i.Top]&&t.createEdge(e,e.neighbours[i.Top])})},linkEdges:function(){t.edges.forEach(function(e){e.vertices.forEach(function(t){t.edges.forEach(function(t){e!=t&&e.neighbours.push(t)})})})},createFace:function(e,r,a,s){var c=[];e.edges.forEach(function(e){(e.vertices.includes(r)||e.vertices.includes(a))&&c.push(e)}),s.edges.forEach(function(e){(e.vertices.includes(r)||e.vertices.includes(a))&&c.push(e)});var o=n.Face();o.vertices[i.TopRight]=a,o.vertices[i.TopLeft]=s,o.vertices[i.BottomLeft]=r,o.vertices[i.BottomRight]=e,t.faces.push(o),e.faces.push(o),r.faces.push(o),a.faces.push(o),s.faces.push(o),c.forEach(function(e){o.edges.push(e),e.faces.push(o)})},createFaces:function(){t.forEach(function(e){e.neighbours[i.Left]&&e.neighbours[i.Top]&&t.createFace(e,e.neighbours[i.Left],e.neighbours[i.Top],e.neighbours[i.Top].neighbours[i.Left])})},linkFaces:function(){t.faces.forEach(function(e){e.vertices.forEach(function(t){t.faces.forEach(function(t){e!=t&&e.neighbours.push(t)})})})},forEach:function(e){for(var r=t.rows-1;r>=0;r--)for(var n=t.cols-1;n>=0;n--)e(t.vertices[r][n],r,n)}});return t.init(),t}},{"../base/makrene.base":1}],5:[function(e,t,r){t.exports=function(){var e={init:function(e){e.forEach(function(e){e.data.degree=e.data.degree%360,e.data.Orginaldegree=e.data.degree,e.data.OrginalLevel=e.data.level})},step:function(e){e.forEach(function(e){var t=e.data.Orginaldegree,r=e.data.degree,n=180-Math.abs(Math.abs(t-r)-180);if(Math.abs(n)>=1){var i=180-Math.abs(Math.abs(t+1-r)-180);e.data.degree+=i>n?1:-1,e.data.degree=e.data.degree%360}var a=e.data.OrginalLevel,s=e.data.level;Math.abs(a-s)>.1&&(e.data.level+=a>s?.1:-.1)})}};return e}},{}],6:[function(e,t,r){var n={DephFirstSearch:function(e,t,r){r=r||[];var i=[];i.pushArray(r),!r.includes(e)&&t>0&&(i.push(e),e.visit(),e.neighbours.forEach(function(e){e&&n.DephFirstSearch(e,t-1,i)}))},BreadthFirstSearch:function(e,t,r){if(r=r||[],t>0){var i=[];e.forEach(function(e){if(e){r.push(e),e.visit();for(var t=e.neighbours.length-1;t>=0;t--)r.includes(e.neighbours[t])||i.push(e.neighbours[t])}}),n.BreadthFirstSearch(i,t-1,r)}},BreadthFirstSearchIterate:function(e,t,r){if(r=r||[],0===r.length&&e.forEach(function(e){e.data.visited=!1,e.data.lastVisit=Number.MAX_VALUE}),0!=t.length){var i=[];return t.forEach(function(e){e&&(r.push(e),e.data.visited=!0,e.data.lastVisit=Date.now(),e.neighbours.forEach(function(e){!e||e.data.visited||i.includes(e)||i.push(e)}))}),{visited:t,visitedAll:r,nextvertices:i,next:function(){return n.BreadthFirstSearchIterate(e,i,r)}}}}};t.exports=n},{}],7:[function(e,t,r){var n=e("./makrene.visualizer");t.exports=function(e,t,r){var i=(r.width-r.vertexWidth)/2,a=(r.height-r.vertexHeight)/2;n(e,t,r,function(e){return i+(Math.cos(.0174532925*e.data.degree)*(e.data.level*r.levelOffset)+r.vertexWidth/2)},function(e){return a+(Math.sin(.0174532925*e.data.degree)*(e.data.level*r.levelOffset)+r.vertexHeight/2)})}},{"./makrene.visualizer":10}],8:[function(e,t,r){function n(e,t){for(var r=2*Math.PI,n=t*Math.PI/180;n<-Math.PI;)n+=r;for(;n>Math.PI;)n-=r;var i,a=Math.atan2(e.height,e.width),s=Math.tan(n);i=n>-a&&n<=a?1:n>a&&n<=Math.PI-a?2:n>Math.PI-a||n<=-(Math.PI-a)?3:4;var c={x:e.width/2,y:e.height/2},o=1,u=1;switch(i){case 1:u=-1;break;case 2:u=-1;break;case 3:o=-1;break;case 4:o=-1}return 1===i||3===i?(c.x+=o*(e.width/2),c.y+=u*(e.width/2)*s):(c.x+=o*(e.height/(2*s)),c.y+=u*(e.height/2)),c}var i=e("./makrene.visualizer");t.exports=function(e,t,r){var a=(r.width-r.vertexWidth)/2,s=(r.height-r.vertexHeight)/2;r.levelOffset=r.levelOffset||r.width/2/t.numCircleLevels,i(e,t,r,function(e){return e.data.level==t.numCircleLevels?n(r,e.data.degree).x:a+(Math.cos(.0174532925*e.data.degree)*(e.data.level*r.levelOffset)+r.vertexWidth/2)},function(e){return e.data.level==t.numCircleLevels?n(r,e.data.degree-180).y:s+(Math.sin(.0174532925*e.data.degree)*(e.data.level*r.levelOffset)+r.vertexHeight/2)})}},{"./makrene.visualizer":10}],9:[function(e,t,r){var n=e("./makrene.visualizer");t.exports=function(e,t,r){n(e,t,r,function(e){return r.offset+((r.vertexWidth+r.margin)*e.data.col+r.vertexWidth/2)},function(e){return r.offset+((r.vertexHeight+r.margin)*e.data.row+r.vertexHeight/2)})}},{"./makrene.visualizer":10}],10:[function(e,t,r){function n(e,t,r,n,i){var a=e.measureText("M").width,s=e.measureText(t).width,c=2;e.fillStyle="white",e.fillRect(r-s/2-c,n-a/2-c,s+2*c,a+2*c),e.strokeStyle=e.fillStyle=i,e.fillText(t,r-s/2,n+a/2)}t.exports=function(e,t,r,i,a){r=Object.assign({width:100,height:100,levelOffset:10,vertexWidth:100,vertexHeight:100,lineColor:100,vertexColor:100,lineWidth:100,drawFaces:!0,drawEdges:!0,drawVertices:!0,drawFacesDebugText:!1,drawEdgesDebugText:!1,drawVertexDebugText:!1},r),i=i||function(e){return e.data.x?e.data.x:(e.data.x=Math.random()*r.width,e.data.x)},a=a||function(e){return e.data.y?e.data.y:(e.data.y=Math.random()*r.height,e.data.y)},r.drawFaces&&t.faces.forEach(function(t){e.beginPath(),e.fillStyle="rgba(0,0,0,0.2)";var r=t.vertices[0];e.moveTo(i(r),a(r)),t.vertices.forEach(function(t){e.lineTo(i(t),a(t))}),e.fill()}),r.drawEdges&&t.edges.forEach(function(t){e.beginPath(),e.lineWidth=r.lineWidth,e.strokeStyle=r.lineColor;var n=t.vertices[0],s=t.vertices[1];e.moveTo(i(n),a(n)),e.lineTo(i(s),a(s)),e.stroke()}),r.drawVertices&&t.forEach(function(t){t&&(e.beginPath(),e.fillStyle=r.vertexColor,e.fillRect(i(t)-r.vertexWidth/2,a(t)-r.vertexHeight/2,r.vertexWidth,r.vertexHeight))}),r.drawVertexDebugText&&t.forEach(function(t){t&&n(e,"i"+t.id+"n"+t.neighbours.length+"e"+t.edges.length+"f"+t.faces.length,i(t),a(t),"red")}),r.drawEdgesDebugText&&t.edges.forEach(function(t){var r=t.vertices[0],s=t.vertices[1];n(e,"i"+t.id+"n"+t.neighbours.length+"v"+t.vertices.length+"f"+t.faces.length,i(r)+(i(s)-i(r))/2,a(r)+(a(s)-a(r))/2,"blue")}),r.drawFacesDebugText&&t.faces.forEach(function(t){var r=(i(t.vertices[0])+i(t.vertices[1])+i(t.vertices[2]))/3,s=(a(t.vertices[0])+a(t.vertices[1])+a(t.vertices[2]))/3;n(e,"i"+t.id+"n"+t.neighbours.length+"v"+t.vertices.length+"e"+t.edges.length,r,s,"black")})}},{}],11:[function(e,t,r){"function"!=typeof Object.assign&&!function(){Object.assign=function(e){"use strict";if(void 0===e||null===e)throw new TypeError("Cannot convert undefined or null to object");for(var t=Object(e),r=1;r<arguments.length;r++){var n=arguments[r];if(void 0!==n&&null!==n)for(var i in n)n.hasOwnProperty(i)&&(t[i]=n[i])}return t}}(),Array.prototype.includes||(Array.prototype.includes=function(e){"use strict";var t=Object(this),r=parseInt(t.length)||0;if(0===r)return!1;var n,i=parseInt(arguments[1])||0;i>=0?n=i:(n=r+i,n<0&&(n=0));for(var a;n<r;){if(a=t[n],e===a||e!==e&&a!==a)return!0;n++}return!1}),Array.prototype.first||(Array.prototype.first=function(){return this[0]})},{}]},{},[2])(2)});
//# sourceMappingURL=makrene-min.js.map
