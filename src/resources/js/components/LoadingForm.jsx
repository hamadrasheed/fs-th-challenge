import React from "react";
import { LOADING_IMG } from "../vars/assets";

function LoadingForm() {
    return (
        <div className="flex justify-center items-center mt-24">
            <img src={LOADING_IMG()} alt="loading" className="w-52 h-52" />
        </div>
    );
}

export default LoadingForm;
