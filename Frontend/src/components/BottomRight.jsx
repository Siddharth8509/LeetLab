import { useEffect, useState } from "react";

export default function BottomRight({prop}) {

    const[example,setExample] = useState(0);
    
    function testCaseHandler (value)
    {
      return setExample(value);
    };

    return (
      <div className="h-full bg-gray-800">

        <div className="h-12 bg-amber-500 flex gap-4 px-2 items-center">
        {prop?.visibleTestCase.map((_,index)=>(
          <div key={index}>
            <button className="btn" onClick={()=>testCaseHandler(index)}>Test Case {index+1}</button>
          </div>
        ))}
        </div>
        
        <div className="bg-amber-50 h-full px-4">
          <div>
            <p className="font-bold text-black text-[17px]">Input :</p>
            <div className="h-10  w-80 border-dashed border-black border-2 rounded-2xl text-black flex items-center p-2 text-[19px]">
            {prop?.visibleTestCase[example].input}
            </div>
          </div>
          <div>
            <p className="font-bold text-black text-[17px]">Output :</p>
            <div className="h-10  w-80 border-dashed border-black border-2 rounded-2xl text-black flex items-center p-2 text-[19px]">
            {prop?.visibleTestCase[example].output}
            </div>
          </div>
        </div>

      </div>
    );
}