import { useState, useEffect } from 'react';

export function useSearch(seriesData = []) {
    
    const [searchTxt, setSearchText] = useState("");
    
    const [searchResult, setSearchResult] = useState([]);

    const handleSearch = (txtInput) => {
        setSearchText(txtInput);
    };

    useEffect(() => {
        
        if (!searchTxt.trim()) {
            setSearchResult([]);
            return;
        }

        const filtered = seriesData.filter((series) =>
            series.status === "Publishing" &&
            series.title.toLowerCase().includes(searchTxt.toLowerCase())
        );

        setSearchResult(filtered);
    }, [searchTxt, seriesData]);

    return ({
        searchTxt,     
        searchResult,  
        handleSearch   
    });

}