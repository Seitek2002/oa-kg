export const Test = (text, setState, localData) => {
  if(text !== localData) {
   setState(text); 
  }
};
