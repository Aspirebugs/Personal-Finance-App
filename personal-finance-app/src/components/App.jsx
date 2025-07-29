import Auth from "./Auth.jsx"
import {Routes,Route} from "react-router-dom"
import Layout from "./Layout.jsx"
import Dashboard from "./Dashboard.jsx"
import Insights from "./Insights.jsx"
import Missing from "./Missing.jsx"


function App() {

  return (
   
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Layout />} />
        <Route path="/*" element={<Missing />} />
      </Routes>

  )
}

export default App