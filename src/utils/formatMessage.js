import React from 'react';
const mapLinkRegex = /(https?:\/\/www\.google\.com\/maps\/search\/\?api=1&query=[^\s]+)/g;

// Function to format message and replace map links with clickable links
export const formatMessageLocationLink = (message) => {
    return message.split(mapLinkRegex).map((part, index) => {
        if (mapLinkRegex.test(part)) {
            return (
                <a key={index} href={part} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                    📍 View Location
                </a>
            )
        } else {
            return <span key={index}>{part}</span>;
        }
    });
}