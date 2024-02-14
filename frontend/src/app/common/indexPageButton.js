import React from 'react';
import Link from 'next/link';

import { House } from 'react-bootstrap-icons';

export const IndexPageElement = () => {
    const indexPageButton = (
        <div className="index-label">
            <Link legacyBehavior href="/">
                <button className="btn btn-primary"><House size={"1.5em"}/></button>
            </Link>
        </div>
    );
    
    return indexPageButton;
};

export default IndexPageElement;