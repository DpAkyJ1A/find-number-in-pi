import React, { useState, useEffect } from "react";
import style from './SearchBar.module.css';

export default function SearchBar(props) {
  const [tempQuery, setTempQuery] = useState(props.searchQuery);

  useEffect(() => {
    setTempQuery(props.searchQuery);
  }, [props.searchQuery]);

  return (
    <div className={style.searchWrapper}>
      <div className={`${style.searchBox} ${props.isNotFound ? style.shake : ''}`}>
        <input
          type="text"
          placeholder="Search..."
          value={tempQuery}
          onChange={(e) => {
            const regex = /^\d+$/;
            if (regex.test(e.target.value) || e.target.value === "")
              setTempQuery(e.target.value);
          }}
        />
      </div>
      <button
        className={style.btn}
        onClick={() => {
          props.setSearchQuery(tempQuery);
          setTimeout(() => {
            props.setIsNotFound(false);
          }, 1000);
        }}
      >
        Find me!
      </button>
    </div>
  );
}
