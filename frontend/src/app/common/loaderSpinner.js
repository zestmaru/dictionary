import React from 'react';
import { Oval } from 'react-loader-spinner';

const LoaderSpinner = () => (
  <Oval
    visible={true}
    height="80"
    width="80"
    color="#0069d9"
    secondaryColor="#0062cc"
    ariaLabel="oval-loading"
    wrapperStyle={{}}
    wrapperClass=""
  />
);

export default LoaderSpinner;
