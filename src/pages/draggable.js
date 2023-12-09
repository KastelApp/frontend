import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
const Arr = [
  {
    name: "North",
    key: "12353",
  },
  {
    name: "South",
    key: "23463",
  },
  {
    name: "East",
    key: "54643",
  },
  {
    name: "West",
    key: "4435",
  },
];
const Projects = () => {
  const [project, setProject] = useState(Arr);
  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    const projects = reorder(
      project,
      result.source.index,
      result.destination.index,
    );
    //store reordered state.
    setProject(projects);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              border: "1px solid #242424",
              opacity: 0.5,
              borderRadius: "5px",
            }}
          >
            {project &&
              project.map((item, index) => (
                <Draggable draggableId={item.key} key={item.key} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <p style={{ color: "green" }}>{item.name}</p>
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
export default Projects;
