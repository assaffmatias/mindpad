import React, { useState, useEffect, useRef } from "react";
import styles from './Main.module.css'

const Main = ({ data, setData, blur }) => {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [speaking, setSpeaking] = useState(false);

    const recognitionRef = useRef(null);

    useEffect(() => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Tu navegador no soporta reconocimiento de voz");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        // recognition.lang = "en-US";
        recognition.lang = "es-ES";

        recognition.onresult = (event) => {
            let interimTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    setTranscript((prev) => prev + result[0].transcript + " ");
                } else {
                    interimTranscript += result[0].transcript;
                }
            }

            setSpeaking(interimTranscript.length > 0);
        };

        recognition.onend = () => {
            if (recognitionRef.current.listening) recognition.start();
        };

        recognitionRef.current = recognition;
        recognitionRef.current.listening = false;
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("myData");

        if (saved) {
            setData(JSON.parse(saved));
        }
    }, []);


    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (!listening) {
            recognitionRef.current.start();
            recognitionRef.current.listening = true;
        } else {
            recognitionRef.current.stop();
            recognitionRef.current.listening = false;
        }

        setListening(!listening);
    };

    const handleInput = (event) => {
        setTranscript(event.target.value);
    };

    const handleKey = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (transcript.trim() === "") return;

            const newItem = {
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                value: transcript,
                readOnly: false
            };

            setData((prev) => {
                const updated = [...prev, newItem];
                localStorage.setItem("myData", JSON.stringify(updated));
                return updated;
            });
            setTranscript("");
        }
    };

    const handleDelete = (id) => {
        setData((prevData) => {
            const updatedData = prevData.filter(item => item.id !== id);
            localStorage.setItem("myData", JSON.stringify(updatedData));
            return updatedData;
        });
    };

    return (
        <div className={styles.main}>
            <h1 className={styles.title}>Today</h1>
            <div className={`${styles.input_container} ${transcript.length > 0 ? styles.input_transcript : ""}`}>
                <input
                    className={styles.input}
                    onChange={handleInput}
                    onKeyDown={handleKey}
                    value={transcript}
                    type="text"
                    placeholder="What's on your mind?"
                />
                <button className={styles.mic} onClick={toggleListening} data-listening={listening}>
                    <svg className={styles.mic_svg} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"></path>
                    </svg>
                </button>
            </div>
            <hr className={styles.hr} data-listening={speaking} />

            <div className={styles.data_container}>
                {data.map(item => (
                    <div className={styles.data_content} key={item.id}>
                        <p className={`${styles.data_text} ${blur ? styles.data_text_blur : ""}`} key={item.id}>
                            {item.value}
                        </p>

                        <svg className={styles.trash_svg} onClick={() => handleDelete(item.id)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Main;
