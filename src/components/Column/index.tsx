import "./index.css";
import menu from "../../assets/delete.svg";
import React, { useRef, useState } from "react";
import { nanoid } from "nanoid";
import { ColumnProps, ColumnWrapProps } from "../types";
import { Draggable, Droppable } from "react-beautiful-dnd";

interface typeProps {
  id: string;
  tables: ColumnProps[];
  setColumnWrap: (data: ColumnWrapProps[]) => void;
  setIds: (data: string) => void;
  index: number;
}

const Column: React.FC<typeProps> = ({
  id,
  tables,
  setColumnWrap,
  setIds,
  index,
}) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const keyRef = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const key = useRef<HTMLInputElement>(null);
  const stored = localStorage.getItem("id")
    ? JSON.parse(localStorage.getItem("id")!)
    : "";
  const [ids, setId] = useState<string>(stored);
  const columnStored = localStorage.getItem("columns")
    ? JSON.parse(localStorage.getItem("columns")!)
    : [];
  const [columns, setColumns] = useState<ColumnProps[]>(columnStored);

  function validate(
    name: HTMLInputElement | null,
    key: HTMLInputElement | null
  ) {
    if (!name?.value.trim()) {
      alert("Name bo'sh bo'lishi mumkin emas!");
      name?.focus();
      return false;
    }
    if (!key?.value.trim()) {
      alert("Key bo'sh bo'lishi mumkin emas!");
      key?.focus();
      return false;
    }
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const isValid = validate(nameRef.current, keyRef.current);
    if (isValid) {
      const column: ColumnProps = {
        id: nanoid(),
        name: nameRef.current?.value,
        key: keyRef.current?.value,
      };
      let copied = JSON.parse(JSON.stringify(columns));
      copied = copied.map((el: ColumnWrapProps) => {
        if (el.id === id) {
          el.tables.push(column);
        }
        return el;
      });
      setColumns(copied);
      setColumnWrap(copied);
      localStorage.setItem("columns", JSON.stringify(copied));
      nameRef.current!.value = "";
      keyRef.current!.value = "";
    }
  }

  function handleDelete() {
    const isDelete = confirm("Rostdan ham o'chirmoqchimisiz?");
    if (isDelete) {
      setIds(id);
    }
  }

  function Deleted(elId: string) {
    const isDelete = confirm("Rostdan ham o'chirmoqchimisiz?");
    if (isDelete) {
      let copied = JSON.parse(JSON.stringify(columns));
      copied = copied.map((el: ColumnWrapProps) => {
        if (el.id === id) {
          el.tables = el.tables.filter((item) => item.id !== elId);
        }
        return el;
      });
      setColumns(copied);
      setColumnWrap(copied);
      localStorage.setItem("columns", JSON.stringify(copied));
    }
  }

  function Edited(el: ColumnProps) {
    setId(el.id);
    localStorage.setItem("id", JSON.stringify(el.id));
  }

  function handleEdit() {
    let copied = JSON.parse(JSON.stringify(columns));

    copied = copied.map((el: ColumnWrapProps) => {
      el.tables = el.tables.map((item) => {
        if (item.id == ids) {
          item.name = name.current?.value ? name.current?.value : item.name;
          item.key = key.current?.value ? key.current?.value : item.key;
        }

        return item;
      });

      return el;
    });
    setColumns(copied);
    setColumnWrap(copied);
    localStorage.setItem("columns", JSON.stringify(copied));
  }

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="column-wrap">
            <div
              className="modal fade"
              id="exampleModal"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Edit message
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          Name:
                        </label>
                        <input
                          ref={name}
                          type="text"
                          className="form-control"
                          id="recipient-name"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="recipient-name"
                          className="col-form-label"
                        >
                          Key:
                        </label>
                        <input
                          ref={key}
                          type="password"
                          className="form-control"
                          id="recipient-name"
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleEdit}
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                    >
                      Save message
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} name="form" className="column">
              <img
                onClick={handleDelete}
                src={menu}
                width={32}
                height={32}
                alt="menu icon"
              />
              <div className="input-column">
                <label htmlFor="ustun">Ustun nomi</label>
                <input
                  ref={nameRef}
                  id="ustun"
                  type="text"
                  placeholder="Ustun nomi"
                />
              </div>
              <div className="input-key">
                <label htmlFor="key">Key</label>
                <input
                  ref={keyRef}
                  id="key"
                  type="password"
                  placeholder="Key"
                />
              </div>
              <button type="submit" className="d-none"></button>
            </form>
            <table className="table">
              <thead className="table-light text-center">
                <tr>
                  <th className="text-start px-3">N%</th>
                  <th>Ustun nomi</th>
                  <th>Key</th>
                  <th>Action</th>
                </tr>
              </thead>

              <Droppable droppableId={id}>
                {(provided) => (
                  <tbody
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="table text-center"
                  >
                    {tables &&
                      tables.map((el, index) => (
                        <Draggable
                          draggableId={el.id}
                          key={el.id}
                          index={index}
                        >
                          {(provided) => (
                            <tr
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                            >
                              <td className="text-start px-3">{index + 1}</td>
                              <td>{el.name}</td>
                              <td>{el.key}</td>
                              <td className="d-flex justify-content-center m-0 p-0">
                                <span
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                  data-bs-whatever="@fat"
                                  onClick={() => {
                                    Edited(el);
                                  }}
                                  className="text-danger"
                                >
                                  edit
                                </span>
                                <span
                                  onClick={() => {
                                    Deleted(el.id);
                                  }}
                                  className="text-success"
                                >
                                  trash
                                </span>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </table>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
