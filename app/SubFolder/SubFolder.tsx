import React,{useState} from 'react'
import Container from '@mui/material/Container';
import Image from 'next/image';
import { Popper } from '@mui/base/Popper';
import { modifyAndSaveFileOrFolder } from '../utils';
import CustomSeparator from '../Breadcrumb/Breadcrumb';

export const SubFolder = ({ data, renameinput, setrenameinput, renamefileorfolder ,deletefileorfolder, handledoubleclick, breadcrumbs, updatecontainerdata }) => {

const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;


return (
  <div className="w-[400px] ml-8 mt-4 border-2 border-solid border-slate-500 bg-white rounded-xl shadow-xl p-4">
    <CustomSeparator breadcrumbs={breadcrumbs} updatecontainerdata={updatecontainerdata} />
    <table className="table-auto w-full">
      <tbody>
        {data && data.length > 0 ? data.map((eachItem,index) =>
          <tr key={index}>
            <td className="cursor-pointer flex py-2">
              <span className='flex px-4' onClick={eachItem.type === 'Folder' ? (e) => handledoubleclick(eachItem,12345) : null }>
                <Image className='mr-2' src={eachItem.type === 'File' ? '/file.png' : '/folder.png'} alt={eachItem.type === 'File' ? 'File' : 'Folder'} width={24} height={24}/>
                {eachItem.name}
              </span>
            </td>
            <td className="delete-rename-icon">
              <Image className='delete-icon' width={24} height={24} alt="delete" src="/delete.png" 
                onClick={() => deletefileorfolder(eachItem.type,eachItem.name)} 
              />
            </td>
            <td>
              <Image className='rename-icon' width={24} height={24} alt="rename" src="/rename.png" onClick={handleClick} />
              <Popper id={id} open={open} anchorEl={anchorEl}>
                <div className='bg-white border-2 border-solid rounded-xl p-5 shadow-lg'>
                  <input type="text" className='border-2 border-black border-xl' value={renameinput} onChange={(e) => setrenameinput(e)} />
                  <button className='bg-emerald-300 h-8 text-white flex p-2 mt-2 gap-x-2 rounded-full items-center' onClick={() => {renamefileorfolder(index);setAnchorEl(null);} }>Rename</button>
                </div>
              </Popper>
            </td>
          </tr>
        ) : 
        <tr>
          <td colSpan="3">No items to display</td>
        </tr>
        }
      </tbody>  
    </table>
  </div>
)};
