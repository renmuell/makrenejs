# makrene.js

A JavaScript library for exploring special polygon mesh structures. At its core, this library utilizes graph theory, mesh visualization, and higher operations. Each element connects with its neighbors, its fundamentals and their abstractions. For example, an edge knows its vertices, their neighbors and faces that connect to it.

## Fundamentals

### Vertex

A point in space that holds data.

#### Syntax

```javascript
var vertex = Makrene.Vertex();
```

#### Properties

| Property | Description |
|-----------|------------|
| neighbors | A list of vertices, each connected to this vertex. |
| edges  | A list of edges, all of which point this vertex. |
| faces  | A list of faces each containing this vertex. |
| data  | The information associated with this vertex. |

### Edge

An edge represents a connection between two vertices.

#### Syntax

```javascript
var vertex = Makrene.Edge();
```

#### Properties

| Property | Description |
|-----------|------------|
| neighbors | A list of edges, each connected to this edge. |
| vertices  | A list of vertices, each vertex is part of this edge. |
| faces  | A list of faces, each including this edge. |
| data  | The information associated with this edge. |

### Face

A face represents an area between closed connected edges.

#### Syntax

```javascript
var vertex = Makrene.Face();
```

#### Properties

| Property | Description |
|-----------|------------|
| neighbors | A list of faces each connected to this face. |
| vertices  | A list of vertices, each is part of this face. |
| edges  | A list of edges, all of which are part of this face. |
| data  | The information associated with this face. |

### Graph

A graph is a set of connected vertices, edges, and faces.

#### Syntax

```javascript
var graph = Makrene.Graph();
```

## Structures

### Circle

A circle has multiple levels, each with a fixed number of vertices. The center has only one vertex. This center connects with each vertex of the first level. Each vertex on a level is then connected with their neighbors on the same level and two vertices of the lower and upper level.

This structure behaves like a sequence. The first element is the center. Each new vertex grows farther out. The last element is the vertex with the highest degree on the outer level. The data structure is highly dynamic with multiple methods to mutate its state.

#### Syntax

```javascript
var circle = Makrene.Circle({ numVertexOnLevel: 10 });
```

### Grid

A grid is a multi-linked graph of rows and columns. 

Currently, it is a very simple data structure. It is static, which means it will create every vertex when it is created.

#### Syntax

```javascript
var grid = Makrene.Grid({ rows: 3, cols: 2 });
```

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
