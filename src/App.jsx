import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Internal Components

const ColourPalette = ({colour}) =>{
  const handleCopy = (e) =>{
    navigator.clipboard.writeText(e.target.innerText);
    toast("Copied to clipboard");
  }
  return(
    <div style={{backgroundColor:colour}} className=" flex items-center justify-center text-xl font-medium">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        theme='light'
      />
      <p onClick={handleCopy} className="hover:cursor-pointer p-2">{colour}</p>
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
  const [colours, setColours] = useState(Array.from({length:5}, generateRandomColour))
  
  const generateNewColourPalette = () =>{
    let newColours= []
    for(let i=0; i<5; i++){
      newColours[i] = generateRandomColour()
    }

    setColours(newColours);
  }
  
  document.body.onkeyup = function(e){
    if(e.key == " " || e.code == "space")
      generateNewColourPalette()
  }
  return (
    <div className="flex flex-col h-screen">
      <div className="h-24 flex items-center justify-between px-6 md:px-8 lg:px-12">
        <h1 className="text-4xl font-bold text-amber-500">Colours</h1>
        <button className="bg-amber-500 px-2 py-2 rounded text-white hover:bg-amber-600 delay-100">Download</button>
      </div>
      <div className="grow bg-purple-50 grid grid-cols-1 md:grid-cols-5">  
        {
          colours.map((colour , index)=>{
            return <ColourPalette key={index} colour={colour} />
          })
        }
      </div>
    </div>
  )
}

export default App