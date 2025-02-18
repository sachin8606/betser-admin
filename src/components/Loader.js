import React from "react";
import "../assets/css/loader.css";
const Loader = ({ size = "md", text = "Loading..." }) => {
    const loaderSizeClass = size === "sm" ? "loader-sm" : size === "lg" ? "loader-lg" : "loader-md";

    return (
        <div className="loader-container">
            <div className={`volt-loader ${loaderSizeClass}`}></div>
        </div>
    );
};

export default Loader;
