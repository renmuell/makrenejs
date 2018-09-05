# makrene.js

javascript graph/mash library

## Fundamentals

### Vertex

A vertex is a fundamental element of a graph. It represent an node which can hold data and can be linked to create a graph.

#### Syntax

var vertex = Makrene.Vertex();

#### Properties

neighbors	- List of connected vertex neighbors
edges	- List of edges, where this vertex is part of
faces	- List of faces, where this vertex is part of
data	- The data for this vertex

### Edge

A edge represents a connection of two vertices.

#### Syntax

var vertex = Makrene.Edge();

#### Properties

neighbors	- List of connected edge neighbors
vertices	- List of vertices, where this edge is part of
faces	- List of faces, where this edge is part of
data	- The data for this edge

### Face

A face represents a area between closed connected edges. Also known as polygon.

#### Syntax

var vertex = Makrene.Face();

#### Properties

neighbors	- List of connected face neighbors
vertices	- List of vertices, where this face is part of
edges	- List of edges, where this face is part of
data	- The data for this face

### Graph

A graph is a set of connected vertices, edges and faces.

#### Syntax

var graph = Makrene.Graph();

## Structures

### Circle

Multi linked circle mesh.

The circle contains multiple levels/rings, each with a max number of vertices. The center contains one vertex, connected with each of the first level/ring. Each level vertex is connected with their visual neighbor and two vertices of the lower and higher level/ring (because each level/ring is offset by half the distance of each vertex, which puts every vertex in the middle of the vertices below and above).

Behaves like a sequence. The first element is the center of the circle and it grows outside, by which the last element is the vertex with the highest degree/angle on the outer level/ring. The data structure is highly dynamic, with multiple method to mutate its state.

#### Syntax

var circle = Makrene.Circle({ numVertexOnLevel: 10 });

### Grid

Multi linked grid mesh.

Current it is a very simple data structure. It is static, which means it will create every vertex when it is created.

#### Syntax

var grid = Makrene.Grid({ rows: 3, cols: 2 });

## Visualizer

### Visualizer.Visualizer

### Visualizer.Circle

### Visualizer.CircleFullscreen

### Visualizer.Grid

## Search

### DepthFirstSearch

### BreadthFirstSearch

### BreadthFirstSearchIterate

## KI

### KI.Circle
