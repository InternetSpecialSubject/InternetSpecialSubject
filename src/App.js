import {Routes, Route} from "react-router-dom";
import Home from "./webPage/Home";
import ErrorPage from "./webPage/error/errorPage";
import Login from "./webPage/Login";
import PlaylistSelector from "./webPage/PlaylistSelector";
import Callback from "./webPage/Callback";

function App() {
    return (
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path="/login" element={<Login />} />
                <Route path="/playlists" element={<PlaylistSelector />} />
                <Route path="/callback" element={<Callback />} />
                <Route path='*' element={<ErrorPage/>}/>
            </Routes>
    );
}

export default App;