import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../components/img/LoginSuccess.json'; // Import your Lottie animation JSON here

const LoginSuccess = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        backgroundColor: false,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <Lottie 
            options={defaultOptions}
            height={400}
            width={400}
        />
        );
};

export default LoginSuccess;
