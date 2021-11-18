import React, { useState, useEffect } from 'react';

function LangDropdown({ data }){
    const [ languages, setLanguages ] = useState([]);
    let options = null;

    useEffect( // run whenever data changes
        () => {
            let langArray = [];
            data.children[0].children.forEach( (document) => {
                langArray.push(document.language);
            });
            langArray.sort((a, b) => a.name > b.name)
            setLanguages(langArray);
        },
        [data]
    )

    const createOption = (language) => {
        return (<option key={language.code} value={language.code}>{language.name}</option>)
    }

    options = 
            languages &&
            languages.map( (language) => {
                return createOption(language)
            });
    // console.log(options);
    return(
        
        <select name="languages" id="languages">
            {options}
        </select>
    )
}

export default LangDropdown;