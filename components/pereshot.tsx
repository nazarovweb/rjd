"use client"
import { useState } from "react"

const Pereshot = () => {
    const [numbers, setNumbers] = useState<Boolean>(false)
    const [statistics, setStatistics] = useState<Boolean>(false)
    const [isstarted, setIsstarted] = useState<Boolean>(false)
    const [counter, setCounter] = useState({ seconds: 0, minutes: 0 })
    function startWork() {
        const interval = setInterval(() => updateCounter(), 1000);
        return () => {
            clearInterval(interval);
        };
    }
    const updateCounter = () => {
        setCounter(counter => {
            let { seconds, minutes } = { ...counter };
            if (seconds === 59) {
                seconds = 0;
                minutes++;
            } else {
                seconds++;
            }
            return {
                seconds,
                minutes
            }
        });
    }

    return (
        <div className="mt-5">
            <div className="worker-wrapper px-5">
                <div className="card" onClick={() => { setNumbers(!numbers); setStatistics(false) }}>
                    <div className="brigada flex flex-col items-center justify-around">
                        <span className="brigadir"></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className=" flex-1 ">
                        <p className="task_name text-center">Pereshot</p>
                        <div className="vagons flex gap-0.5 justify-center mt-2 flex-wrap gap-y-5 px-5 pt-2">
                            <span className="vagon">1</span>
                            <span className="vagon">2</span>
                            <span className="vagon">3</span>
                            <span className="vagon">4</span>
                            <span className="vagon">5</span>
                            <span className="vagon">6</span>
                            <span className="vagon">7</span>
                            <span className="vagon">8</span>
                            <span className="vagon">9</span>
                            <span className="vagon">10</span>
                            <span className="vagon">11</span>
                            <span className="vagon">12</span>
                            <span className="vagon">13</span>
                            <span className="vagon">14</span>
                            <span className="vagon pending">15</span>
                            <span className="vagon done">16</span>
                            <span className="vagon pending">17</span>
                            <span className="vagon done">18</span>
                        </div>
                    </div>

                    <div className="sostav_name bg-amber-600 px-4 flex flex-col justify-center align-middle">
                        <p className=" text-4xl font-bold">28</p>
                        <p>sostav</p>
                    </div>
                </div>
            </div>
            {numbers && <div className="numbers flex gap-1.5 mt-5 px-5">
                <div className="number" onClick={() => setStatistics(true)}>22421</div>
                <div className="number">24241</div>
                <div className="number">22245</div>
                <div className="number">22514</div>
                <div className="number">23412</div>
                <div className="number">25122</div>
                <div className="number">25432</div>
                <div className="number">25353</div>
                <div className="number">02000</div>
                <div className="number">02001</div>
                <div className="number">16004</div>
                <div className="number">10212</div>
                <div className="number">10545</div>
                <div className="number">14545</div>
                <div className="number">15422</div>
                <div className="number">16521</div>
                <div className="number">17535</div>
                <div className="number">18533</div>
            </div>}

            {statistics && <div className="pereshot-info px-5 mt-5">
                {isstarted && <div className="statistics mt-4">
                    <div className="prostin">
                        <p>Простыня́</p>
                        <div>
                            <button className="bg-red-400">-</button>
                            <input value={150} type="tel" />
                            <button className="bg-green-400">+</button>
                        </div>
                    </div>
                    <div className="pododeyalnik">
                        <p>Пододеяльник</p>
                        <div>
                            <button className="bg-red-400">-</button>
                            <input value={150} type="tel" />
                            <button className="bg-green-400">+</button>
                        </div>
                    </div>
                    <div className="navolochka">
                        <p>Наволочка</p>
                        <div>
                            <button className="bg-red-400">-</button>
                            <input value={150} type="tel" />
                            <button className="bg-green-400">+</button>
                        </div>
                    </div>
                    <div className="maxra">
                        <p>Полотенце</p>
                        <div>
                            <button className="bg-red-400">-</button>
                            <input value={150} type="tel" />
                            <button className="bg-green-400">+</button>
                        </div>
                    </div>
                    <div className="meshok">
                        <p>Мешок</p>
                        <div>
                            <button className="bg-red-400">-</button>
                            <input value={15} type="tel" />
                            <button className="bg-green-400">+</button>
                        </div>
                    </div>
                </div>}

                <div className="flex mt-4 gap-1">

                    <button className=" bg-green-950 text-white rounded-4xl flex-1 py-3 text-2xl" onClick={() => { setIsstarted(true); !isstarted && startWork() }}> {isstarted ? ' сохранить' : "Начать работу"} </button>
                    <button className=" border-2 px-5 text-3xl rounded-full" onClick={() => setStatistics(false)}> {counter.minutes > 0 && counter.minutes + ":" } {counter.seconds}</button>
                </div>
            </div>}

            
        </div>
    )
}

export default Pereshot