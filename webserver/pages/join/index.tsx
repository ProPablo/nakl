
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
const JoinIndex = () => {
  const [data, setData] = useState('No result');

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            //@ts-ignore
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        //@ts-ignore
        style={{ width: '100%' }}
      />
      <p>{data}</p>
    </>
  );

}

export default JoinIndex;