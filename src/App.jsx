
import { RouterProvider } from "react-router-dom"
import router from "./routes"
import Header from "./components/header"

const App = () => {
  
  
  return (
   
    <>
   
    <RouterProvider router={router} />
    </>
  )
}

export default App