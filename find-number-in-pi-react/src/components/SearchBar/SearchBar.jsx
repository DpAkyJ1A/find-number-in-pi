import React, { useState, useEffect } from "react";
import style from './SearchBar.module.css';

export default function SearchBar(props) {
  const [tempQuery, setTempQuery] = useState(props.searchQuery);

  useEffect(() => {
    setTempQuery(props.searchQuery);
  }, [props.searchQuery]);

  const handleBtnClick = () => {
    props.setSearchQuery(tempQuery);
    setTimeout(() => {
      props.setIsNotFound(false);
    }, 1000);
  }

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      handleBtnClick();
    }
  };

  return (
    <div className={style.searchWrapper}>
      <div
        className={`${style.searchBox} ${props.isNotFound ? style.shake : ""}`}
      >
        <input
          type="text"
          placeholder="Search..."
          value={tempQuery}
          onChange={(e) => {
            const regex = /^\d+$/;
            if (
              (regex.test(e.target.value) || e.target.value === "") &&
              e.target.value.length <= 30
            )
              setTempQuery(e.target.value);
          }}
          onKeyDown={handleEnterKeyPress}
        />
      </div>
      <button className={style.btn} onClick={handleBtnClick}>
        Find me!
      </button>
    </div>
  );
}
