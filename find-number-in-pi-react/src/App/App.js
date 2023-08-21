import React, { useEffect, useRef, useState } from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import ScrollToTopButton from "../components/ScrollToTopButton/ScrollToTopButton";
import { PI } from "../PI";
import style from "./App.module.css";
import { TypeAnimation } from "react-type-animation";

const MILLIONS = 5;
const PIReduced = PI.slice(0, MILLIONS * 1000000);
const digitsInRow = Math.floor((1265 - 3) / (16 * 0.6 + 3));

export default function App() {
  const piWrapperRef = useRef(null);
  const batchSize = 100000;
  const PIDigitsAfterComa = PIReduced.slice(2);
  const PIBeforeComa = PIReduced.slice(0, 2);
  const [PIBatchArray, setPIBatchArray] = useState(
    (() => {
      let PIBatchArray = [];
      for (
        let i = 0;
        i < Math.floor(PIDigitsAfterComa.length / batchSize);
        i++
      ) {
        PIBatchArray.push(
          PIDigitsAfterComa.slice(i * batchSize, (i + 1) * batchSize)
        );
      }
      return PIBatchArray;
    })()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPIBatchIndex, setSelectedPIBatchIndex] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [index, setIndex] = useState(null);
  const [showText, setShowText] = useState(false);

  const [infoTop, setInfoTop] = useState(-100);
  const [infoLeft, setInfoLeft] = useState(-100);

  async function handleSearchChange() {
    setIndex(null);
    setShowText(false);

    const PIBatchArrayCopy = PIBatchArray.slice();
    if (typeof selectedPIBatchIndex === "number") {
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
      setSearchQuery("");
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

    setSearchQuery("");

    const screenHeight = window.innerHeight;
    const { top, left } = piWrapperRef.current.getBoundingClientRect();
    const totalTop = lineIndex * 16 * 1.15 + top;
    const targetScrollHeight =
      screenHeight < totalTop ? totalTop - screenHeight / 2 : 0;
    
    // const infoTopCalc =
    //   Math.floor((searchIndex + searchQuery.length - 1) / digitsInRow) + 1 ===
    //   lineIndex
    //     ? totalTop - 16 * 1.15
    //     : totalTop;
    
    // const infoLeftCalc =
    //   left +
    //   (((searchIndex + searchQuery.length - 1) % digitsInRow) + 1) *
    //     (16 * 0.6 + 3);
    
    // setInfoTop(infoTopCalc);
    // setInfoLeft(infoLeftCalc);

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
          // setTimeout(() => {
          //   setIndex(searchIndex);
          // }, 500);
          // setTimeout(() => {
          //   setShowText(true);
          // }, 1500);
          window.removeEventListener("scroll", detectScrollStop);
          return searchIndex;
        }, scrollTimeout);
      }

      window.addEventListener("scroll", detectScrollStop);
    } else {
      setPIBatchArray(PIBatchArrayCopy);
      // setTimeout(() => {
      //   setIndex(searchIndex);
      // }, 500);
      // setTimeout(() => {
      //   setShowText(true);
      // }, 1500);
    }

    return searchIndex;
  }

  useEffect(() => {
    if (searchQuery !== "") {
      handleSearchChange().then((searchIndex) => {
        setTimeout(() => {
          const highlight = document.querySelector(".highlight");
          const { top, right } = highlight.getBoundingClientRect();
          setInfoTop(top + window.scrollY);
          setInfoLeft(right + window.scrollX);

          console.log(`top = ${top}`);
          console.log(`window.scrollY = ${window.scrollY}`);
          console.log(`right = ${right}`);
          console.log(`window.scrollX = ${window.scrollX}`);

          setTimeout(() => {
            setIndex(searchIndex);
          }, 500);
          setTimeout(() => {
            setShowText(true);
          }, 1500);
        }, 1000);
      });
    }
  }, [searchQuery]);

  return (
    <>
      <TypeAnimation
        sequence={[`Find your number in ${MILLIONS}M digits of PI!`, 1000]}
        speed={50}
        repeat={1}
        style={{
          fontSize: "3em",
          color: "white",
          fontWeight: "bold",
          fontFamily: "monospace",
        }}
      />
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
      <div
        className={`${style.info} ${
          typeof index === "number" ? style.active : ""
        }`}
        style={{
          top: `${infoTop}px`,
          left: `${infoLeft}px`,
        }}
      >
        {showText && (
          <TypeAnimation
            sequence={[`i = ${index + 1}`, 1000]}
            speed={50}
            repeat={1}
            className={style.infoText}
            style={{
              color: "white",
              fontFamily: "monospace",
              fontSize: "16px",
            }}
          />
        )}
      </div>
      <ScrollToTopButton />
    </>
  );
}
