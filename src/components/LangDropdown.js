import React, { useState, useEffect } from 'react';

function LangDropdown({ changeParameter, data }){
    const [ languages, setLanguages ] = useState([]);
    let options = null;

    const handleChange = (e) => {
        changeParameter('lang.code', e.target.value);
    }

    useEffect( // run whenever data changes
        () => {
            if(data){
                let langArray = [];
                data.children[0].children.forEach( (document) => {
                    langArray.push(document.language);
                });
                langArray.sort((a, b) => a.name > b.name)
                setLanguages(langArray);
            }
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
        <select onChange={handleChange} name="languages" id="languages">
            <option key="allLangs" value="">All Languages</option>
            {options}
        </select>
    )
}

export default LangDropdown;