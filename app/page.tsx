"use client"
import React, {useState,useEffect} from 'react';
import Image from 'next/image';
import { Popper } from '@mui/base/Popper';
import { modifyAndSaveFileOrFolder } from './utils';
import { SubFolder } from './SubFolder/SubFolder';



// function findObjectPath(array, target, path = []) {
//     for (let i = 0; i < array.length; i++) {
//         const current = array[i];
//         if (current === target) {
//             return [...path, i];
//         } else if (typeof current === 'object' && current !== null) {
//             const nestedPath = findObjectPath(current, target, [...path, i]);
//             if (nestedPath) {
//                 return nestedPath;
//             }
//         }
//     }
//     return null;
// }
function isEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            (areObjects && !isEqual(val1, val2)) ||
            (!areObjects && val1 !== val2)
        ) {
            return false;
        }
    }

    return true;
}

function isObject(obj) {
    return obj != null && typeof obj === 'object';
}

function findObjectPath(array, target, path = []) {
    for (let i = 0; i < array.length; i++) {
        const current = array[i];
        if (isEqual(current, target)) {
            return [...path, i];
        } else if (isObject(current)) {
            const nestedPath = findObjectPath(current.content || [], target, [...path, i, 'content']);
            if (nestedPath) {
                return nestedPath;
            }
        }
    }
    return null;
}



export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showModalForType,setShowModalForType] = useState('File');
  const [fileInput, setFileInput] = useState('');
  const [data, setData] = useState<Array<{ type: string; name: string }>>([]);
  const [inputError, setInputError] = useState(false);
  const [filePath, setFilePath] = useState('/');
  const [renameInput,setRenameInput] = useState('');
  const [showContainer, setShowContainer] = useState(false);
  const [containerData, setContainerData] = useState([]);
  const [rootIndex, setRootIndex] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

    const handleDoubleClick = (event,i) => {
      if (i === 12345) {
        const fullPath = findObjectPath(data, event);
        let crumbs = [];
        let nestedObject = data;
        fullPath.forEach((index) => {
          nestedObject = nestedObject[index];
          if (typeof index === 'number') {
            crumbs.push(nestedObject.name);
          }
        });
        setBreadcrumbs(crumbs);
        setFilePath(fullPath);
        setContainerData(nestedObject);
      }
      else if (event.detail === 2) {
        setRootIndex(i);
        setFilePath([i]);
        setContainerData(data[i]?.content);
        setShowContainer(true);
      }
    }

const updateContainerData = (breadcrumb) => {
  let targetObject = data;
  let fullPath = [];

  // Finding the object with the given breadcrumb name
  const findObjectByName = (objArray, name) => {
    for (let i = 0; i < objArray.length; i++) {
      const obj = objArray[i];
      fullPath.push(i); // Add the index to fullPath
      if (obj.name === name) {
        targetObject = obj;
        return true;
      }
      if (obj.content) {
        if (findObjectByName(obj.content, name)) {
          return true;
        }
      }
      fullPath.pop(); // Remove the index if not found
    }
    return false;
  };


  findObjectByName(data, breadcrumb);
  if (targetObject !== null) {
    // Constructing the breadcrumbs
    const crumbs = fullPath.map((index) => {
      const obj = data[index];
      return obj.name;
    });

    crumbs?.length > 1 ? setBreadcrumbs(crumbs) : setBreadcrumbs([]);
    setContainerData(targetObject.content);

  }
};

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;


  useEffect(() => {
    setFileInput('');
  },[showModal]);

  useEffect(() =>{
      const storedData = localStorage.getItem('driveData');

  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
    } catch (error) {
      setData([]);
    }
  }
  },[]);

// const handleCreateFileOrFolder = (name: string, type: 'File' | 'Folder') => {

// if (typeof name !== 'string' || !name.trim()) {
//     setInputError(true);
//     return;
//   }

//   // If filePath is empty or '/', create at the root level
//   if (!filePath || filePath === '/') {
//     const newItem = {
//       type,
//       name
//     };
//     const newData = [...data, newItem];
//     setData(newData);
//     modifyAndSaveFileOrFolder(newData);
//     return;
//   } else {
  
// let parentObject = data;
// let previousIndex = null;


// for (let i = 0; i < filePath.length; i++) {
//   const index = filePath[i];

//   if (index === 'content') {
//     // Check if the previous index exists and it's a number
//     if (typeof previousIndex === 'number') {
//       // Navigate to the appropriate parent folder based on the previous index
//       // parentObject = parentObject[previousIndex];
//       // Access the content property of the parent folder
//       parentObject = parentObject?.content ? parentObject.content : parentObject[previousIndex];
//     } else {
//       console.error('Invalid filePath');
//       return;
//     }
//   }
//   else {
//     // Access the property directly if it's not 'content'
//     if (previousIndex === 'content' && typeof index === 'number') {
//     parentObject = parentObject[index]?.content;
//     console.log(parentObject,'parentObject')
//     }
//     parentObject = parentObject[index];
//   }

//   // Update the previousIndex for the next iteration
//   previousIndex = index;
// }

// console.log(parentObject,'parentObject')

//   if (Array.isArray(parentObject)) {
//   // Create a new item based on the type
//   const newItem = {
//     type,
//     name,
//     content: type === 'Folder' ? [] : undefined // Initialize content only for folders
//   };
//   // Push the new item to the array
//   parentObject.push(newItem);
// } else {
//   // If parentObject is not an array, it's an object
//   if (type === 'Folder') {
//     // For folders, create a new object with the content property as an empty array
//     parentObject[name] = { type, name, content: [] };
//   } else {
//     // For files, create a new object without the content property
//     console.log(parentObject,'parentObject')
//     parentObject[name] = { type, name };
//   }
// }
//   }

const handleCreateFileOrFolder = (name: string, type: 'File' | 'Folder') => {
  if (typeof name !== 'string' || !name.trim()) {
    setInputError(true);
    return;
  }

if (!filePath || filePath === '/') {
    const newItem = {
      type,
      name
    };
    const newData = [...data, newItem];
    setData(newData);
    modifyAndSaveFileOrFolder(newData);
    return;
  } else {

  let parentObject = data;
  let previousIndex = null;

  for (let i = 0; i < filePath.length; i++) {
    const index = filePath[i];

    if (index === 'content') {
      parentObject = parentObject.content;
    } else {
      parentObject = parentObject[index];
    }

    previousIndex = index;
  }
  if (Array.isArray(parentObject)) {
    const newItem = {
      type,
      name,
      content: type === 'Folder' ? [] : undefined
    };
    parentObject.push(newItem);
  } else {
    
    if (type === 'Folder') {
      
      parentObject.content.push({ type, name, content: [] });
    } else {
      parentObject.content.push({ type, name });
    }
  }
    setData([...data]);
    modifyAndSaveFileOrFolder([...data]);
  }
  
  setShowModal(false);
  setFileInput('');
  setInputError(false);
};

const deleteFileOrFolder = (type:string , name: string) => {
  const confirmation = window.confirm("Are you sure you want to delete this item?");
  if (confirmation && rootIndex === null) {
    const indexToRemove = data.findIndex(obj => obj.type === type && obj.name === name);
    const filteredArray = data.reduce<{ type: string; name: string }[]>((acc, curr, index) => {
    if (index !== indexToRemove) {
      acc.push(curr);
    }
    return acc;
  }, []);
    setData(filteredArray);
    modifyAndSaveFileOrFolder(filteredArray);
  } else {
    const indexToRemove = data[rootIndex].content.findIndex(obj => obj.type === type && obj.name === name);
    const filteredArray = data[rootIndex].content.reduce<{ type: string; name: string }[]>((acc, curr, index) => {
    if (index !== indexToRemove) {
      acc.push(curr);
    }
    return acc;
  },[]);
  let newData = data;
  newData[rootIndex].content = filteredArray;
    setData(newData);
    setContainerData(newData[rootIndex].content);
    modifyAndSaveFileOrFolder(newData);
  }
  return;
};

const handleRenameClick = (e) => {
  setRenameInput(e.target.value)
};

const renameFileOrFolder = (index:number) => {

  if (typeof renameInput !== 'string' || !renameInput.trim()) {
    return;
  }
  let newData = data;
  if (rootIndex) {

    newData[rootIndex].content[index].name = renameInput;
  } else {
      newData[index].name = renameInput;
  }
    setData(newData);
    setContainerData(newData[rootIndex].content);
    modifyAndSaveFileOrFolder(newData);
    setAnchorEl(null);
    return true;
};


  return (
    <div className="flex relative h-lvh">
      <div className="sidebar">
      </div>
      <div className="w-full relative left-8 top-2">
        <div className="flex">
          <button className="bg-emerald-300 h-10 text-white flex p-2 gap-x-2 rounded-full items-center " onClick={()=>{setShowModal(!showModal);setShowModalForType('File')}} >
            <Image src="/plus.png" width="20" height="20" alt="upload file" />
            <span className="">Create File</span>
          </button>
          <button className="bg-emerald-300 h-10 text-white flex p-2 gap-x-2 rounded-full items-center " onClick={()=>{setShowModal(!showModal);setShowModalForType('Folder')}} >
            <Image src="/plus.png" width="20" height="20" alt="upload file" />
            <span className="">Create Folder</span>
          </button>
        </div>
        {showModal ? (<div className="modal flex flex-col absolute bg-white border-2 border-solid rounded-xl p-5 shadow-lg top-16">
          <div className="flex">
            <strong className="text-black text-xl pr-4">{showModalForType} Name:</strong>
            <input
                type="text"
                className={`border-2 ${inputError ? 'border-red-500' : 'border-rose-500'} text-black text-[14px] px-1 w-25`}
                placeholder={`Enter ${showModalForType} name`}
                value={fileInput}
                onChange={(e) => {
                  setFileInput(e.target.value);
                  setInputError(false);
                }}
              ></input>
          </div>
            {inputError && <p className="text-red-500 bg-white text-base">{showModalForType === 'File' ? 'Please enter a valid file name with extension' : 'Please enter a valid folder name'}</p>}
            <button
              className="bg-emerald-300 h-10 text-white flex p-2 gap-x-2 rounded-full items-center w-fit"
              onClick={() => handleCreateFileOrFolder(fileInput, showModalForType)}
            >
              Create
            </button>
          </div>
        ): null}
        <div className="text-black flex">
          <table className="table-auto">
            <thead>
            <tr>
            <td><h1 className="text-center">File/Folder List</h1></td>
            </tr>
            </thead>
            <tbody>
              {data?.map((eachItem,index) =>
                (<tr key={index}>
                  <td className="cursor-pointer flex py-2">
                  <span className="flex px-4" onClick={eachItem.type === 'Folder' ? (e) => handleDoubleClick(e,index) : null }>
                    <Image className="mr-2" src={eachItem.type === 'File' ? '/file.png' : '/folder.png'} alt={eachItem.type === 'File' ? 'File' : 'Folder'} width={24} height={24}/>
                    {eachItem.name}
                  </span>
                  </td>
                  <td className="delete-rename-icon">
                      <Image className='delete-icon' width={24} height={24} alt="delete" src="/delete.png" onClick={() => deleteFileOrFolder(eachItem.type,eachItem.name)} />
                    </td>
                    <td>
                    <Image className='rename-icon' width={24} height={24} alt="rename" src="/rename.png" onClick={handleClick} />
                    <Popper id={id} open={open} anchorEl={anchorEl}>
                      <div className='bg-white border-2 border-solid rounded-xl p-5 shadow-lg'>
                        <input type="text" className='border-2 border-black border-xl' value={renameInput} onChange={(e) => setRenameInput(e.target.value)} />
                        <button className='bg-emerald-300 h-8 text-white flex p-2 mt-2 gap-x-2 rounded-full items-center' onClick={() => renameFileOrFolder(index)}>Rename</button>
                      </div>
                    </Popper>
                  </td>
                </tr>
              ))}
            </tbody>  
          </table>
          {showContainer && 
            <SubFolder
              data={containerData} 
              renameinput={renameInput} 
              setrenameinput={handleRenameClick} 
              renamefileorfolder={renameFileOrFolder}
              deletefileorfolder={deleteFileOrFolder}
              handledoubleclick={handleDoubleClick}
              breadcrumbs={breadcrumbs}
              updatecontainerdata={updateContainerData}
            />
            }
        </div>
      </div>
    </div>
  );
}
