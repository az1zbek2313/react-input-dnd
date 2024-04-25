import { useEffect, useState } from 'react'
import './App.css'
import addIcon from "./assets/add-square.svg"
import Column from './components/Column';
import { ColumnWrapProps } from './components/types';
import { nanoid } from 'nanoid';



function App() {
  const [columnWrap, setColumnWrap] = useState<ColumnWrapProps[]>(localStorage.getItem("columns")?JSON.parse(localStorage.getItem("columns")!):[]);
  const [id, setId] = useState<string>("");
  function handleClick() {
    const wrap:ColumnWrapProps = {
      id:nanoid(),
      tables:[]
    }
    let copied = JSON.parse(JSON.stringify(columnWrap));
    copied.push(wrap);
    setColumnWrap(copied);
    localStorage.setItem("columns", JSON.stringify(copied));
  }

      
  function handleDelete() {
        let copied = JSON.parse(JSON.stringify(columnWrap));
        copied = copied.filter((el:ColumnWrapProps) => el.id !== id); 
        setColumnWrap(copied);
        localStorage.setItem("columns", JSON.stringify(copied));
    }

    useEffect(() => {
      handleDelete();
    }, [id, columnWrap])

  return (
    <>
     <div className='project'>
      <h1>Loyiha  ketma-ketligi</h1>
      <div className='project-column'>
        {
          columnWrap && columnWrap.map(el => (
            <Column setIds={setId} key={el.id} id={el.id} tables={el.tables} setColumnWrap={setColumnWrap}/>
          ))
        }
      </div>
      <div onClick={handleClick} className="add-column">
        <img src={addIcon} alt="add icon" />
        <h5>Ustun qo’shish</h5>
      </div>
     </div>
    </>
  )
}

export default App
