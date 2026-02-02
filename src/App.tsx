import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">FlexTranslator</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <p className="mb-4 text-gray-700">Project setup complete!</p>
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default App
