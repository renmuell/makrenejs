!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.Makrene=e()}}(function(){return function i(a,s,c){function o(r,e){if(!s[r]){if(!a[r]){var t="function"==typeof require&&require;if(!e&&t)return t(r,!0);if(u)return u(r,!0);throw new Error("Cannot find module '"+r+"'")}var n=s[r]={exports:{}};a[r][0].call(n.exports,function(e){var t=a[r][1][e];return o(t||e)},n,n.exports,i,a,s,c)}return s[r].exports}for(var u="function"==typeof require&&require,e=0;e<c.length;e++)o(c[e]);return o}({1:[function(e,t,r){var n;n={version:"0.1.1",Vertex:function e(t){var r=Object.create(e.prototype,{});return Object.assign(r,{edges:[],faces:[],neighbors:[],data:t||{}})},isVertex:function(e){return void 0!==e&&e instanceof n.Vertex},Edge:function e(t){var r=Object.create(e.prototype,{});return Object.assign(r,{vertices:[],faces:[],neighbors:[],data:t||{}})},isEdge:function(e){return void 0!==e&&e instanceof n.Edge},Face:function e(t){var r=Object.create(e.prototype,{});return Object.assign(r,{vertices:[],edges:[],neighbors:[],data:t||{}})},isFace:function(e){return void 0!==e&&e instanceof n.Face},Graph:function e(t,r){return void 0===r&&(r=Object.create(e.prototype,{})),Object.assign(r,{_onChangeCallbacks:[],_suppressEventFires:!1,vertices:[],edges:[],faces:[],neighbors:[],data:t||{},addVertex:function(e){return r.vertices.push(e),r.emitChange({action:"addVertex",graph:r,newObject:e}),r},addEdge:function(e){return r.edges.push(e),r.emitChange({action:"addEdge",graph:r,newObject:e}),r},addFace:function(e){return r.faces.push(e),r.emitChange({action:"addFace",graph:r,newObject:e}),r},forEach:function(e){r.vertices.forEach(e)},onChange:function(e){r._onChangeCallbacks.push(e)},emitChange:function(t){r._suppressEventFires||r._onChangeCallbacks.forEach(function(e){e(t)})}})},isGraph:function(e){return void 0!==e&&e instanceof n.Graph}},t.exports=n},{}],2:[function(e,t,r){t.exports=Object.assign(e("./base/makrene.base"),{Circle:e("./graph/makrene.graph.circle"),Grid:e("./graph/makrene.graph.grid"),Ki:{Circle:e("./ki/makrene.ki.circle")},Search:e("./search/makrene.search"),Visualizer:Object.assign(e("./visualizer/makrene.visualizer"),{Grid:e("./visualizer/makrene.visualizer.grid"),Circle:e("./visualizer/makrene.visualizer.circle"),CircleFullscreen:e("./visualizer/makrene.visualizer.circleFullscreen")})})},{"./base/makrene.base":1,"./graph/makrene.graph.circle":3,"./graph/makrene.graph.grid":4,"./ki/makrene.ki.circle":5,"./search/makrene.search":6,"./visualizer/makrene.visualizer":10,"./visualizer/makrene.visualizer.circle":7,"./visualizer/makrene.visualizer.circleFullscreen":8,"./visualizer/makrene.visualizer.grid":9}],3:[function(e,t,r){!function(){var o=e("../base/makrene.base");function u(e,t,r){return 0===r?0:(r-1)*e.numVertexOnLevel+t+1}function i(e,t){if(0==t)return{level:0,position:0};var r=Math.floor(t%e.numVertexOnLevel),n=Math.floor(t/e.numVertexOnLevel);return{level:0===r?n:n+1,position:0===r?e.numVertexOnLevel-1:r-1}}function f(t,r,n){n&&(r.neighbors.push(n),n.neighbors.push(r),h(t,r,n),r.neighbors.filter(function(e){if(n!=e)return n.neighbors.includes(e)}).forEach(function(e){l(t,r,n,e)}))}function h(e,t,r){var n=o.Edge();n.vertices.push(t),n.vertices.push(r),n.id=e.edges.length,e.edges.push(n),r.edges.push(n),t.edges.push(n),a(n,t),a(n,r)}function a(t,e){e.edges.forEach(function(e){t==e||t.neighbors.includes(e)||(t.neighbors.push(e),e.neighbors.push(t))})}function l(e,t,r,n){var i=o.Face();i.vertices.push(t),i.vertices.push(r),i.vertices.push(n),t.faces.push(i),r.faces.push(i),n.faces.push(i),i.id=e.faces.length,i.data={level:Math.min(t.data.level,r.data.level,n.data.level)},e.faces.push(i),s(i,t),s(i,r),s(i,n);var a=[];a.push(t.edges.filter(function(e){return e.vertices.includes(r)})[0]),a.push(r.edges.filter(function(e){return e.vertices.includes(n)})[0]),a.push(n.edges.filter(function(e){return e.vertices.includes(t)})[0]),a.forEach(function(e){e.faces.push(i),i.edges.push(e)})}function s(t,e){e.faces.forEach(function(e){t==e||t.neighbors.includes(e)||(t.neighbors.push(e),e.neighbors.push(t))})}function v(e,t,r){var n=360/e.numVertexOnLevel/2;return n+n*t+360/e.numVertexOnLevel*r}t.exports=function e(t){t=Object.assign({numVertexOnLevel:8},t);var a=0,s=0,c=Object.create(e.prototype,{numVertexOnLevel:{value:t.numVertexOnLevel},numCircleLevels:{get:function(){return a}},length:{get:function(){return s}},isEmpty:{get:function(){return 0===c.vertices.length}},first:{get:function(){return c.vertices[0]?c.vertices[0][0]:void 0}},center:{get:function(){return c.first}},last:{get:function(){return c.isEmpty?void 0:1===c.length?c.center:c.vertices[a][c.vertices[a].length-1]}}});return Object.assign(c,o.Graph({},c),{push:function(){return[].forEach.call(arguments,function(e){c._suppressEventFires=!0,void 0!==e&&e instanceof o.Vertex||(e=o.Vertex(e||{})),c.isEmpty?c.addVertexAt(0,0,e):0==a||c.vertices[a].length===c.numVertexOnLevel?c.addVertexAt(a+1,0,e):c.addVertexAt(a,c.vertices[a].length,e),c._suppressEventFires=!1,c.emitChange({action:"push",graph:c,newObject:e})}),c.length},pop:function(){c._suppressEventFires=!0;var e=c.removeVertex(c.last);return c._suppressEventFires=!1,c.emitChange({action:"pop",graph:c,removedObject:e}),e},shift:function(){var e;if(c._suppressEventFires=!0,!c.isEmpty){if(1===c.length)e=c.last,c.removeVertex(c.last);else{for(var t=[],r=c.vertices.length-1;0<=r;r--)t[r]=c.vertices[r][0],c.removeVertex(c.vertices[r][0]);for(var n=c.vertices.length-1;0<=n;n--)c.vertices[n].shift(),c.vertices[n].forEach(function(e,t){e&&(e.data.degree=v(c,n,t),e.data.level=n,e.id=e.data.level+"_"+e.data.degree)});s--,c.addVertexAt(0,0,t[1]);for(var i=t.length-1;2<=i;i--)c.addVertexAt(i-1,c.numVertexOnLevel-1,t[i]);e=t[0]}return c._suppressEventFires=!1,c.emitChange({action:"shift",graph:c,removedObject:e}),e}},unshift:function(){return[].forEach.call(arguments,function(e){if(c._suppressEventFires=!0,void 0!==e&&e instanceof o.Vertex||(e=o.Vertex(e||{})),c.isEmpty)c.addVertexAt(0,0,e);else{var t=c.length,r=[c.center];c.removeVertex(c.center);for(var n=c.vertices.length-1;0<=n;n--)c.vertices[n][c.numVertexOnLevel-1]&&(r[n]=c.vertices[n][c.numVertexOnLevel-1],c.removeVertex(c.vertices[n][c.numVertexOnLevel-1]));for(var i=c.vertices.length-1;0<=i;i--)c.vertices[i].unshift(void 0),c.vertices[i].forEach(function(e,t){e&&(e.data.degree=v(c,i,t),e.data.level=i,e.id=e.data.level+"_"+e.data.degree)});s=t+1;for(var a=r.length-1;0<=a;a--)c.addVertexAt(a+1,0,r[a]);c.addVertexAt(0,0,e)}c._suppressEventFires=!1,c.emitChange({action:"unshift",graph:c,newObject:e})}),c.length},fill:function(e,t,r){for(c._suppressEventFires=!0,void 0!==e&&e instanceof o.Vertex||(e=o.Vertex(e||{})),t=(t=t||0)<0?Math.max(c.length+t,0):Math.min(t,c.length),r=(r=r||c.length)<0?Math.max(c.length+r,0):Math.min(r,c.length);t<r;){var n=i(c,t);c.addVertexAt(n.level,n.position,e),t++}return c._suppressEventFires=!1,c.emitChange({action:"fill",graph:c}),c},expandFromOutside:function(e){for(e=e||c.numVertexOnLevel;0<e;e--)c.push(o.Vertex());return c.length},expandFromInside:function(e){for(e=e||c.numVertexOnLevel;0<e;e--)c.unshift(o.Vertex());return c.length},collapseFromOutside:function(e){var t=[];for(e=e||c.numVertexOnLevel;0<e;e--)t.push(c.pop());return t},collapseFromInside:function(e){var t=[];for(e=e||c.numVertexOnLevel;0<e;e--)t.push(c.shift());return t},clear:function(){s=a=0,c.faces=[],c.edges=[],c.vertices=[],c.neighbors=[],c.data={},c.emitChange({action:"clear",graph:c})},includes:function(t){return 0<c.filter(function(e){return e===t}).length},vertexAt:function(e,t){return c.vertices[e]?c.vertices[e][t]:void 0},vertexAtIndex:function(e){var t=i(c,e);return c.vertexAt(t.level,t.position)},facesAt:function(t){return c.faces.filter(function(e){return e.data.level==t})},getFacesLevelArray:function(){var t=[];return c.faces.forEach(function(e){void 0===t[e.data.level]&&(t[e.data.level]=[]),t[e.data.level].push(e)}),t},indexOf:function(e){for(var t=0,r=c.vertices.length-1,n=0;0<=r;r--,n++){var i=c.vertices[n].indexOf(e);if(0<=i)return t+i;t+=c.vertices[n].length}return-1},addVertexAt:function(e,t,r){if(0!=c.numVertexOnLevel&&!(c.numVertexOnLevel<t||0==c.level&&0!==t)){var n;a<e&&(a=e),c.vertices[e]=c.vertices[e]||[],void 0===r?c.vertices[e][t]=void 0:(r instanceof o.Vertex||(r=o.Vertex(r||{})),r.data.degree=v(c,e,t),r.data.level=e,r.id=r.data.level+"_"+r.data.degree,c.vertices[e][t]=r,0===e?c.vertices[1]&&((n=c).vertices[1].forEach(function(e){e&&(n.first.neighbors.push(e),e.neighbors.push(n.first),h(n,n.first,e))}),n.vertices[1].forEach(function(e,t){if(e){var r=t-1<0?n.numVertexOnLevel-1:t-1;t!=r&&n.vertices[1][r]&&l(n,n.first,e,n.vertices[1][r])}})):(!function(e,t,r){var n=e.vertices[t-1];if(n){var i=e.vertices[t][r],a=n.length-1<r?0:r,s=n.length-1<r+1?0:r+1;n[a]&&(i.neighbors.push(n[a]),n[a].neighbors.push(i),h(e,i,n[a])),a!=s&&n[s]&&(i.neighbors.push(n[s]),n[s].neighbors.push(i),h(e,i,n[s]),n[a]&&l(e,i,n[a],n[s]))}}(c,e,t),function(e,t,r){var n=e.vertices[t+1];if(n){var i=e.vertices[t][r],a=r,s=r-1<0?e.numVertexOnLevel-1:r-1;n[a]&&(i.neighbors.push(n[a]),n[a].neighbors.push(i),h(e,i,n[a])),a!=s&&n[s]&&(i.neighbors.push(n[s]),n[s].neighbors.push(i),h(e,i,n[s]),n[a]&&l(e,i,n[a],n[s]))}}(c,e,t),f(c,r,c.vertices[e][(t-1+c.numVertexOnLevel)%c.numVertexOnLevel]),f(c,r,c.vertices[e][(t+1+c.numVertexOnLevel)%c.numVertexOnLevel])));var i=u(c,t,e);return i>c.length-1&&(s=i+1),c.emitChange({action:"addVertex",graph:c,newObject:r}),c.length}},removeVertexFrom:function(e,t){return c.removeVertex(c.vertexAt(e,t))},removeVertex:function(r){if(r){r.neighbors.forEach(function(e){e.neighbors.splice(e.neighbors.indexOf(r),1)}),r.edges.forEach(function(t){t.neighbors.forEach(function(e){e.neighbors.splice(e.neighbors.indexOf(t),1)}),t.vertices.forEach(function(e){e!=r&&e.edges.splice(e.edges.indexOf(t),1)}),t.faces.forEach(function(e){e.edges.splice(e.edges.indexOf(t),1)}),c.edges.splice(c.edges.indexOf(t),1)}),r.faces.forEach(function(t){t.neighbors.forEach(function(e){e.neighbors.splice(e.neighbors.indexOf(t),1)}),t.vertices.forEach(function(e){e!=r&&e.faces.splice(e.faces.indexOf(t),1)}),t.edges.forEach(function(e){e.faces.splice(e.faces.indexOf(t),1)}),c.faces.splice(c.faces.indexOf(t),1)});var n=0;if(c.vertices.forEach(function(e,t){e.includes(r)&&(n=u(c,e.indexOf(r),t),e.indexOf(r)==e.length-1?e.length=e.length-1:delete e[e.indexOf(r)],a==t&&0===e.length&&(0===c.numCircleLevels?c.vertices=[]:c.vertices.splice(c.vertices.indexOf(e),1)))}),r.edges=[],r.faces=[],r.neighbors=[],n==s-1){for(var e=n-1;0<=e&&void 0===c.vertexAtIndex(e);)e--;a=e<0?s=0:(s=e+1,i(c,e).level)}return c.emitChange({action:"removeVertex",graph:c,removedOObject:r}),r}},forEach:function(n){c.vertices.forEach(function(e,r){e.forEach(function(e,t){n(e,u(c,t,r),c)})})},filter:function(r){var n=[];return c.forEach(function(e,t){r(e,t,c)&&n.push(e)}),n},map:function(r){var n=[];return c.forEach(function(e,t){n.push(r(e,t,c))}),n},toString:function(){return"Makrene.Circle\n\tNumVertexOnLevel: "+c.numVertexOnLevel+"\n\tNumCircleLevels: "+c.numCircleLevels+"\n\tLength: "+c.length+"\n\tEdges: "+c.edges.length+"\n\tFaces: "+c.faces.length}})}}()},{"../base/makrene.base":1}],4:[function(e,t,r){!function(){var c=e("../base/makrene.base"),o={Top:0,Right:1,Bottom:2,Left:3,TopLeft:0,TopRight:1,BottomRight:2,BottomLeft:3};function u(e,t,r){var n=c.Edge();n.vertices.push(t),n.vertices.push(r),e.edges.push(n),r.edges.push(n),t.edges.push(n)}t.exports=function e(t){t=Object.assign({rows:0,cols:0},t);var r,n,i,a,s=Object.create(e.prototype,{rows:{value:t.rows},cols:{value:t.cols}});return s=Object.assign(c.Graph({},s),{forEach:function(e){for(var t=s.rows-1;0<=t;t--)for(var r=s.cols-1;0<=r;r--)e(s.vertices[t][r],t,r)}}),function(e){for(var t=e.rows-1;0<=t;t--){e.vertices[t]=[];for(var r=e.cols-1;0<=r;r--){var n=c.Vertex();n.data.row=t,n.data.col=r,e.vertices[t][r]=n}}}(r=s),(a=r).forEach(function(e,t,r){0<r&&(e.neighbors[o.Left]=a.vertices[t][r-1]),r<a.cols-1&&(e.neighbors[o.Right]=a.vertices[t][r+1]),0<t&&(e.neighbors[o.Top]=a.vertices[t-1][r]),t<a.rows-1&&(e.neighbors[o.Bottom]=a.vertices[t+1][r])}),(i=r).forEach(function(e){e.neighbors[o.Left]&&u(i,e,e.neighbors[o.Left]),e.neighbors[o.Top]&&u(i,e,e.neighbors[o.Top])}),r.edges.forEach(function(t){t.vertices.forEach(function(e){e.edges.forEach(function(e){t!=e&&t.neighbors.push(e)})})}),(n=r).forEach(function(e){e.neighbors[o.Left]&&e.neighbors[o.Top]&&function(e,t,r,n,i){var a=[];t.edges.forEach(function(e){(e.vertices.includes(r)||e.vertices.includes(n))&&a.push(e)}),i.edges.forEach(function(e){(e.vertices.includes(r)||e.vertices.includes(n))&&a.push(e)});var s=c.Face();s.vertices[o.TopRight]=n,s.vertices[o.TopLeft]=i,s.vertices[o.BottomLeft]=r,s.vertices[o.BottomRight]=t,e.faces.push(s),t.faces.push(s),r.faces.push(s),n.faces.push(s),i.faces.push(s),a.forEach(function(e){s.edges.push(e),e.faces.push(s)})}(n,e,e.neighbors[o.Left],e.neighbors[o.Top],e.neighbors[o.Top].neighbors[o.Left])}),r.faces.forEach(function(t){t.vertices.forEach(function(e){e.faces.forEach(function(e){t!=e&&t.neighbors.push(e)})})}),s}}()},{"../base/makrene.base":1}],5:[function(e,t,r){t.exports=function(e){var t={circle:e,step:function(){t.circle.forEach(function(e){var t=e.data.OriginalDegree,r=e.data.degree,n=180-Math.abs(Math.abs(t-r)-180);if(1<=Math.abs(n)){var i=180-Math.abs(Math.abs(t+1-r)-180);e.data.degree+=n<i?1:-1,e.data.degree=e.data.degree%360}var a=e.data.OriginalLevel,s=e.data.level;.1<Math.abs(a-s)&&(e.data.level+=s<a?.1:-.1)})}};return t.circle.forEach(function(e){e.data.degree=e.data.degree%360,e.data.OriginalDegree=e.data.degree,e.data.OriginalLevel=e.data.level}),t}},{}],6:[function(e,t,r){var a;a={DepthFirstSearch:function(e,t,r){!e.data.visited&&0<t&&(e.data.visited=!0,r&&r(e),e.neighbors.forEach(function(e){e&&a.DepthFirstSearch(e,t-1,r)}))},BreadthFirstSearch:function(e,t,r){if(0<t){var n=[];e.forEach(function(e){if(e){e.data.visited=!0,r&&r(e);for(var t=e.neighbors.length-1;0<=t;t--)e.neighbors[t].data.visited||(e.neighbors[t].data.visited=!0,n.push(e.neighbors[t]))}}),a.BreadthFirstSearch(n,t-1,r)}},BreadthFirstSearchIterate:function(e,t,r,n){if(0===(n=n||[]).length&&e.forEach(function(e){e.data.visited=!1,e.data.lastVisit=Number.MAX_VALUE}),0!=t.length){var i=[];return t.forEach(function(e){e&&(n.push(e),e.data.visited=!0,e.data.lastVisit=Date.now(),r&&r(e),e.neighbors.forEach(function(e){!e||e.data.visited||i.includes(e)||(e.data.visited=!0,i.push(e))}))}),{visited:t,visitedAll:n,nextVertices:i,next:function(){return a.BreadthFirstSearchIterate(e,i,r,n)}}}}},t.exports=a},{}],7:[function(e,t,r){var a;a=e("./makrene.visualizer"),t.exports=function(e,t,r){var n=(r.width-r.vertexWidth)/2,i=(r.height-r.vertexHeight)/2;a(e,t,r,function(e){return n+(Math.cos(.0174532925*e.data.degree)*(e.data.level*r.levelOffset)+r.vertexWidth/2)},function(e){return i+(Math.sin(.0174532925*e.data.degree)*(e.data.level*r.levelOffset)+r.vertexHeight/2)})}},{"./makrene.visualizer":10}],8:[function(e,t,r){!function(){var a=e("./makrene.visualizer");function s(e,t){for(var r=2*Math.PI,n=t*Math.PI/180;n<-Math.PI;)n+=r;for(;n>Math.PI;)n-=r;var i,a=Math.atan2(e.height,e.width),s=Math.tan(n);i=-a<n&&n<=a?1:a<n&&n<=Math.PI-a?2:n>Math.PI-a||n<=-(Math.PI-a)?3:4;var c={x:e.width/2,y:e.height/2},o=1,u=1;switch(i){case 1:case 2:u=-1;break;case 3:case 4:o=-1}return 1===i||3===i?(c.x+=o*(e.width/2),c.y+=u*(e.width/2)*s):(c.x+=o*(e.height/(2*s)),c.y+=u*(e.height/2)),c}t.exports=function(e,t,r){r.padding=r.padding||0,r.width-=2*r.padding,r.height-=2*r.padding;var n=(r.width-r.vertexWidth)/2,i=(r.height-r.vertexHeight)/2;r.levelOffset=r.levelOffset||r.width/2/t.numCircleLevels,a(e,t,r,function(e){return r.padding+(e.data.level==t.numCircleLevels?s(r,e.data.degree).x:n+(Math.cos(.0174532925*e.data.degree)*(e.data.level*r.levelOffset)+r.vertexWidth/2))},function(e){return r.padding+(e.data.level==t.numCircleLevels?s(r,e.data.degree-180).y:i+(Math.sin(.0174532925*e.data.degree)*(e.data.level*r.levelOffset)+r.vertexHeight/2))})}}()},{"./makrene.visualizer":10}],9:[function(e,t,r){var n;n=e("./makrene.visualizer"),t.exports=function(e,t,r){n(e,t,r,function(e){return r.offset+((r.vertexWidth+r.margin)*e.data.col+r.vertexWidth/2)},function(e){return r.offset+((r.vertexHeight+r.margin)*e.data.row+r.vertexHeight/2)})}},{"./makrene.visualizer":10}],10:[function(e,t,r){!function(){function o(e,t,r,n,i){var a=e.measureText("M").width,s=e.measureText(t).width;e.fillStyle="white",e.fillRect(r-s/2-2,n-a/2-2,s+4,a+4),e.strokeStyle=e.fillStyle=i,e.fillText(t,r-s/2,n+a/2)}t.exports=function(n,e,i,a,s){i=Object.assign({width:100,height:100,levelOffset:10,vertexWidth:100,vertexHeight:100,lineColor:"red",vertexColor:"white",faceColor:"black",lineWidth:100,drawFaces:!0,drawEdges:!0,drawVertices:!0,drawFacesDebugText:!1,drawEdgesDebugText:!1,drawVertexDebugText:!1,getVertexDebugText:function(e){return"i"+e.id+"n"+e.neighbors.length+"e"+e.edges.length+"f"+e.faces.length}},i),a=a||function(e){return e.data.x||(e.data.x=Math.random()*i.width),e.data.x},s=s||function(e){return e.data.y||(e.data.y=Math.random()*i.height),e.data.y};var c=function(e){return!!(e&&e.constructor&&e.call&&e.apply)};i.drawFaces&&e.faces.forEach(function(e){n.beginPath(),n.fillStyle=c(i.faceColor)?i.faceColor(e):i.faceColor;var t=e.vertices[0];n.moveTo(a(t),s(t)),e.vertices.forEach(function(e){n.lineTo(a(e),s(e))}),n.fill()}),i.drawEdges&&e.edges.forEach(function(e){n.beginPath(),n.lineWidth=i.lineWidth,n.strokeStyle=c(i.lineColor)?i.lineColor(e):i.lineColor;var t=e.vertices[0],r=e.vertices[1];n.moveTo(a(t),s(t)),n.lineTo(a(r),s(r)),n.stroke()}),i.drawVertices&&e.forEach(function(e){e&&(n.beginPath(),n.fillStyle=c(i.vertexColor)?i.vertexColor(e):i.vertexColor,n.fillRect(a(e)-i.vertexWidth/2,s(e)-i.vertexHeight/2,i.vertexWidth,i.vertexHeight))}),i.drawVertexDebugText&&e.forEach(function(e){e&&o(n,i.getVertexDebugText(e),a(e),s(e),"red")}),i.drawEdgesDebugText&&e.edges.forEach(function(e){var t=e.vertices[0],r=e.vertices[1];o(n,"i"+e.id+"n"+e.neighbors.length+"v"+e.vertices.length+"f"+e.faces.length,a(t)+(a(r)-a(t))/2,s(t)+(s(r)-s(t))/2,"blue")}),i.drawFacesDebugText&&e.faces.forEach(function(e){var t=(a(e.vertices[0])+a(e.vertices[1])+a(e.vertices[2]))/3,r=(s(e.vertices[0])+s(e.vertices[1])+s(e.vertices[2]))/3;o(n,"i"+e.id+"n"+e.neighbors.length+"v"+e.vertices.length+"e"+e.edges.length,t,r,"black")})}}()},{}]},{},[2])(2)});
//# sourceMappingURL=makrene-min.js.map
