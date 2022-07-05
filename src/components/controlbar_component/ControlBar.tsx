import React from "react";

export const ControlBar = (props: any) => {

    const squares = [];

    for (let i=0; i<9; i++) {
        squares.push(
            <div className="square"></div>
        );
    }

    return <section className="controlbar">
        <h3>Control Bar</h3>
        <section className="frontal-ansicht">
        </section>
    </section>;

}
