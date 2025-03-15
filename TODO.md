# Alignment when moving nodes

- Labels: `grid`

By default we have free movement.
Using `shift`, nodes should align horizontally or vertically to its original position.
Using `alt`, nodes should align with its neighbors.
Using `cmd`, nodes should align with the grid.

Final modifiers TBD.

# Register DataTypes

- Labels: `core`

Create a DataType registry that can be used to register DataTypes.
A DataType should have a name, description, and a type.

The core application has built-in DataTypes that are always available.
Other nodes/plugins can register their own DataTypes.

The current `DataType` type should be converted to an interface, so its type can be extended.
