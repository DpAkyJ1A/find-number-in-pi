import React, { useEffect, useRef, useState } from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import ScrollToTopButton from "../components/ScrollToTopButton/ScrollToTopButton";
import { PI } from '../PI';
import style from './App.module.css';
import { TypeAnimation } from "react-type-animation";

const digitsInRow = Math.floor((1265 - 3) / (16 * 0.6 + 3));

export default function App() {
  const piWrapperRef = useRef(null);
  const batchSize = 100000;
  const PIDigitsAfterComa = PI.slice(2);
  const PIBeforeComa = PI.slice(0, 2);
  const [PIBatchArray, setPIBatchArray] = useState(
    (() => {
      let PIBatchArray = [];
      for (let i = 0; i < Math.floor(PIDigitsAfterComa.length / batchSize); i++) {
        PIBatchArray.push(
          PIDigitsAfterComa.slice(i * batchSize, (i + 1) * batchSize)
        );
      }
      return PIBatchArray;
    })()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPIBatchIndex, setSelectedPIBatchIndex] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);

  function handleSearchChange() {
    const PIBatchArrayCopy = PIBatchArray.slice();
    if (typeof selectedPIBatchIndex === 'number') {
      PIBatchArrayCopy[selectedPIBatchIndex] = PIDigitsAfterComa.slice(
        selectedPIBatchIndex * batchSize,
        (selectedPIBatchIndex + 1) * batchSize
      );
    }

    const searchIndex = PIDigitsAfterComa.indexOf(searchQuery);

    if (searchIndex == -1) {
      setPIBatchArray(PIBatchArrayCopy);
      setSelectedPIBatchIndex(null);
      setIsNotFound(true);
      setSearchQuery('');
      return;
    }

    const PIBatchIndex = Math.floor(searchIndex / batchSize);
    setSelectedPIBatchIndex(PIBatchIndex);
    const regex = new RegExp(`(${searchQuery})`, "i");
    const lineIndex = Math.floor(searchIndex / digitsInRow) + 1;

    PIBatchArrayCopy[PIBatchIndex] = PIBatchArrayCopy[PIBatchIndex].replace(
      regex,
      '<span class="highlight">$1</span>'
    );

    setSearchQuery('');

    const screenHeight = window.innerHeight;
    const { top } = piWrapperRef.current.getBoundingClientRect();
    const totalTop = lineIndex * 16 * 1.15 + top;
    const targetScrollHeight =
      screenHeight < totalTop ? totalTop - screenHeight / 2 : 0;

    if (targetScrollHeight > 0) {
      window.scrollTo({
        top: targetScrollHeight,
        behavior: "smooth",
      });

      let isScrolling;
      const scrollTimeout = 300; // Set the timeout duration in milliseconds

      function detectScrollStop() {
        clearTimeout(isScrolling);

        isScrolling = setTimeout(function () {
          setPIBatchArray(PIBatchArrayCopy);
          window.removeEventListener("scroll", detectScrollStop);
        }, scrollTimeout);
      }

      window.addEventListener("scroll", detectScrollStop);
    } else {
      setPIBatchArray(PIBatchArrayCopy);
    }
  };

  useEffect(() => {
    if (searchQuery !== '') {
      handleSearchChange();
    }
  }, [searchQuery]);

  return (
    <>
      <div className={style.test}></div>
      <TypeAnimation
        sequence={["Find your number in 1M digits of PI!", 1000]}
        speed={50}
        repeat={1}
        style={{
          fontSize: "3em",
          color: "white",
          fontWeight: "bold",
          fontFamily: "monospace",
        }}
      />
      <ScrollToTopButton />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isNotFound={isNotFound}
        setIsNotFound={setIsNotFound}
      />
      <div ref={piWrapperRef} className={style.piWrapper}>
        <span className={style.piStart}>{PIBeforeComa}</span>
        {PIBatchArray.map((PIBatch, i) => (
          <p
            className={style.pi}
            key={`pi ${i * batchSize}-${(i + 1) * batchSize}`}
            dangerouslySetInnerHTML={{ __html: PIBatch }}
          ></p>
        ))}
      </div>
    </>
  );
}
