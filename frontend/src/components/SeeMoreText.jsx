import React, { useState, useRef, useEffect } from "react";

const SeeMoreText = ({ text, maxLength }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [height, setHeight] = useState("0px");
  const contentRef = useRef(null);

  const toggleIsExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (isExpanded) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight('0px');
    }
  }, [isExpanded]);

  return (
    <>
      <h4
        className="post_caption"
        ref={contentRef}
        style={{
          maxHeight: isExpanded ? height : "inherit",
          transition: "0.3s ease-out",
          overflow: "hidden",
        }}
      >
        {text.length <= maxLength
          ? text
          : isExpanded
          ? text
          : `${text.substring(0, maxLength)}...`}
        {text.length <= maxLength ? (
          ""
        ) : (
          <a className="see_more_link" onClick={toggleIsExpanded}>
            {isExpanded ? "See Less" : "See More"}
          </a>
        )}
      </h4>
    </>
  );
};

export default SeeMoreText;
