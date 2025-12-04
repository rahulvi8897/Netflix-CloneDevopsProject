import React from 'react'
import {BrowserRouter, Link} from "react-router-dom"
import "../App.css"

function Navbar() 
{
  return (
    <div style={{display: "flex", alignItems: "center"}}>
        <img width="150px" height="70px" src="https://i.pcmag.com/imagery/reviews/05cItXL96l4LE9n02WfDR0h-5.fit_scale.size_760x427.v1582751026.png"/>
            <BrowserRouter>
                <Link className='link'>Tv Shows</Link>
                <Link className='link'>Movies</Link>
                <Link className='link'>Recently Added</Link>
                <Link className='link'>My List</Link>
            </BrowserRouter>
    </div>
  )
}

export default Navbar
