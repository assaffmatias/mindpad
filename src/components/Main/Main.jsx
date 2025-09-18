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
        recognition.lang = "en-US";

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

    return (
        <div className={styles.main}>
            <h1 className={styles.title}>Today</h1>
            <div className={styles.input_container}>
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
                    <div className={styles.data_content}>
                        <p className={`${styles.data_text} ${blur ? styles.data_text_blur : ""}`} key={item.id}>
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Main;
