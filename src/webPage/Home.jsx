import Navbar from "./components/Navbar";
import './css/script.css'
export default function Home() {
    return (
        <div className="home">
            <div className="background_container"></div>
                <div className="title">
                    <Navbar/>
                </div>
            <p className="first_p">享受您的音樂，立即登入</p>
        </div>
    )
}