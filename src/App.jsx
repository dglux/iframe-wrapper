import {useEffect, useRef, useState} from 'react'

const PROD_HOST = '????';
const DEV_HOST = 'azure-rnd.iot-dsa.org';

// production server should load dglux from the same host
const PROD_URL = '/dglux5/viewer.html?proj=dcLibrary';
const DEV_URL = `https://${DEV_HOST}/_viewer.html?proj=dcLibrary`;

const IFRAME_URL = window.location.host === PROD_HOST ? PROD_URL : DEV_URL;
const IFRAME_HOST = window.location.host === PROD_HOST ? `https://${PROD_HOST}` : `https://${DEV_HOST}`;

const defaultDgData = '{"@type":"group","width":"100%","height":"100%","focusType":"isolate","Text":{"@type":"text","cornerRadius":0,"multiline":false,"fontSize":"90","border":{"@type":"fill","gradient":{"@type":"gradient","@array":[{"ratio":0,"color":"#000000","alpha":1},{"ratio":100,"color":"#ffffff","alpha":1}]},"color":16777215},"text":"Sample dg5","color":16777215,"background":{"@type":"fill","fillType":"solid","color":26367}},"@array":[["Text"]],"@ver":10040}';

function App() {
  const [data, setData] = useState(defaultDgData);
  const [viewerLoaded, setViewerLoaded] = useState(false);

  const textAreaRef = useRef();
  const iframeRef = useRef();

  const setIframeRef = element => {
    if (element && iframeRef.current !== element) {
      iframeRef.current = element;
      window.addEventListener('message' , (e)=> {
        if (e.data?.dgIframeViewerLoaded) {
          setViewerLoaded(true);
        }
      })
    }
  };

  const onBtnClick = () => {
    setData(textAreaRef.current.value);
  }

  useEffect(()=>{
    if (viewerLoaded && data && iframeRef.current) {
      try {
        const decodedData = JSON.parse(data);
        iframeRef.current.contentWindow.postMessage({dgLoadPageData: decodedData}, IFRAME_HOST);
      } catch(err) {
      }
    }
  }, [viewerLoaded, data])

  return (
    <>
      <div className='leftbox'>
        <textarea defaultValue={defaultDgData} ref={textAreaRef}/>
        <button onClick={onBtnClick}>Update dg5</button>
      </div>
      <div className="rightbox">
        <iframe src={IFRAME_URL} ref={setIframeRef}/>
      </div>
    </>
  )
}

export default App
