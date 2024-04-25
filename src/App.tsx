import { useEffect, useState } from "react";
import "./App.css";
import addIcon from "./assets/add-square.svg";
import Column from "./components/Column";
import { ColumnWrapProps } from "./components/types";
import { nanoid } from "nanoid";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

function App() {
  const [columnWrap, setColumnWrap] = useState<ColumnWrapProps[]>(
    localStorage.getItem("columns")
      ? JSON.parse(localStorage.getItem("columns")!)
      : []
  );
  const [id, setId] = useState<string>("");
  function handleClick() {
    const wrap: ColumnWrapProps = {
      id: nanoid(),
      tables: [],
    };
    let copied = JSON.parse(JSON.stringify(columnWrap));
    copied.push(wrap);
    setColumnWrap(copied);
    localStorage.setItem("columns", JSON.stringify(copied));
  }

  function handleDelete() {
    let copied = JSON.parse(JSON.stringify(columnWrap));
    copied = copied.filter((el: ColumnWrapProps) => el.id !== id);
    setColumnWrap(copied);
    localStorage.setItem("columns", JSON.stringify(copied));
  }

  useEffect(() => {
    if (id !== "") {
      handleDelete();
    }
  }, [id, columnWrap]);

  const handleDragDrop = (results: any) => {
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.draggableId === destination.draggableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const reorderedStores = [...columnWrap];

      const sourceIndex = source.index;
      const destinationIndex = destination.index;

      const [removedStore] = reorderedStores.splice(sourceIndex, 1);
      reorderedStores.splice(destinationIndex, 0, removedStore);

      return setColumnWrap(reorderedStores);
    }

    const storeSourceIndex = columnWrap.findIndex(
      (el) => el.id === source.id
    );
    const storeDestinationIndex = columnWrap.findIndex(
      (store) => store.id === destination.droppableId
    );
    const newSourceItems = [...columnWrap[storeSourceIndex].tables];
    const newDestinitionItems =
      source.droppableProps !== destination.droppableProps
        ? [...columnWrap[storeDestinationIndex].tables]
        : newSourceItems;

    const [deletedItem] = newSourceItems.splice(source.index, 1);
    newDestinitionItems.splice(destination.index, 0, deletedItem);

    const newStores = [...columnWrap];

    newStores[storeSourceIndex] = {
      ...columnWrap[storeSourceIndex],
      tables: newSourceItems,
    };
    newStores[storeDestinationIndex] = {
      ...columnWrap[storeDestinationIndex],
      tables: newDestinitionItems,
    };

    setColumnWrap(newStores)
  };

  return (
    <>
      <div className="project">
        <DragDropContext onDragEnd={handleDragDrop}>
          <h1>Loyiha ketma-ketligi</h1>
          <Droppable droppableId="ROOT" type="group">
            {(provided) => (
              <div
                className="project-column"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {columnWrap &&
                  columnWrap.map((el, index) => (
                    <Column
                      setIds={setId}
                      key={el.id}
                      id={el.id}
                      tables={el.tables}
                      index={index}
                      setColumnWrap={setColumnWrap}
                    />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div onClick={handleClick} className="add-column">
            <img src={addIcon} alt="add icon" />
            <h5>Ustun qo’shish</h5>
          </div>
        </DragDropContext>
      </div>
    </>
  );
}

export default App;
