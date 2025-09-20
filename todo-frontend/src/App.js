import TodoApp from "./TodoApp";
import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom"
import LoginWithNavigate from "./Login";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<LoginWithNavigate/>}></Route>
              <Route path="/home" element={<TodoApp/>}></Route>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
