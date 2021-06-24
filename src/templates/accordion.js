import React, { useState } from 'react'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
function Accordion(props) {

    const [show, setShow] = useState(false);
    return (
        <>
            <div className="main-heading">
                <a onClick={() => setShow(!show)}> {show ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />} </a>
                <h3>{props.title}</h3>

            </div>
            {show && <p className="answers"> taste is gud </p>}

        </>
    )
}

export default Accordion
