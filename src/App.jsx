import { useState,  useCallback, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toPng } from 'html-to-image';

const PALETTE_SIZE = 5;

// Internal Components

const ColourPalette = ({colour, lockStatus, index, onIconClik}) =>{
  const handleCopy = (e) =>{
    navigator.clipboard.writeText(e.target.innerText);
    toast("Copied to clipboard");
  }

  const handleLockUnlock = (e) =>{
    onIconClik(index);
  }
  return(
    <div style={{backgroundColor:colour}} className=" flex flex-col gap-2 items-center justify-center text-xl font-medium text-white">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        theme='light'
      />
      <p onClick={handleCopy} className="hover:cursor-pointer p-2">{colour}</p>
      <div className='cursor-pointer' onClick={handleLockUnlock}>
        {
          lockStatus? 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
            </svg>
          :
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 0 1-1.5 0V6.75a3.75 3.75 0 1 0-7.5 0v3a3 3 0 0 1 3 3v6.75a3 3 0 0 1-3 3H3.75a3 3 0 0 1-3-3v-6.75a3 3 0 0 1 3-3h9v-3c0-2.9 2.35-5.25 5.25-5.25Z" />
              </svg>



        }
      </div>
    </div>
  )
}

const generateRandomColour = () =>{
  let colourCode = "#";
  for (let i=0; i<3; i++){
    let colourInt = Math.random()*256
    colourCode += parseInt(colourInt).toString(16).padStart(2,'0')
  }
  return colourCode
}

const App = () => {
  const ref = useRef(null)
  const [lockStatusArray, setLockStatusArray] = useState(Array.from({length:PALETTE_SIZE}, ()=>{return false}))
  const [colours, setColours] = useState(Array.from({length:PALETTE_SIZE}, generateRandomColour))
  
  const handleDownload = useCallback(() => {
    if (ref.current === null) {
      return
    }

    toPng(ref.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'colour-palette.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref])

  const generateNewColourPalette = () =>{
    let newColours= []
    for(let i=0; i<PALETTE_SIZE; i++){
      if(lockStatusArray[i]){
        newColours[i] = colours[i]
      }
      else{
        newColours[i] = generateRandomColour()
      }
    }

    setColours(newColours);
  }

  const toggleLock = (index) => {
    const newLockStatusArray = [...lockStatusArray]
    newLockStatusArray[index] = !lockStatusArray[index]
    setLockStatusArray(newLockStatusArray)
  }
  
  document.body.onkeyup = function(e){
    if(e.key == " " || e.code == "space")
      generateNewColourPalette()
  }
  return (
    <div className="flex flex-col h-screen relative">
      <div className="h-24 flex items-center justify-between px-6 md:px-8 lg:px-12">
        <h1 className="text-4xl font-bold text-amber-500">Colours</h1>
        <button onClick={handleDownload} className="bg-amber-500 px-2 py-2 rounded text-white hover:bg-amber-600 delay-100">Download</button>
      </div>
      <div ref={ref} className="grow bg-purple-50 grid grid-cols-1 md:grid-cols-5">  
        {
          colours.map((colour , index)=>{
            return <ColourPalette key={index} colour={colour} index={index} lockStatus={lockStatusArray[index]} onIconClik={toggleLock}/>
          })
        }
      </div>
      <button className='absolute transform bottom-32 mx-auto left-40  bg-white w-24 h-14 rounded shadow md:hidden' onClick={generateNewColourPalette}>Generate</button>
    </div>
  )
}

export default App