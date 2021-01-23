import React from "react";
import { Link } from "react-router-dom";

export default function Logo({toPage})
{
    return(
        <Link to={toPage}>
            <h1 className="logo">
                <span className="part-01">Blue</span>
                <span className="part-02">Bank</span>
            </h1>
        </Link>
    );
}