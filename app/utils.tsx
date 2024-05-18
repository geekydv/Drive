// Utilities

export const modifyAndSaveFileOrFolder = (data: any[]) => {
  const serializedData = JSON.stringify(data);
  localStorage.setItem('driveData', serializedData);
};

