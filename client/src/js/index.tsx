import { h, render } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const base = document.querySelector('#base');
if (!base) throw new Error(`No base?!`);

function ApiHello(props: {}) {
    
    const [apiResponse, setApiResponse] = useState<string | null>(null);
    
    useEffect(() => {
        fetch('/api/hello')
            .then(x => x.json())
            .then((resp: any) => {
                setApiResponse(JSON.stringify(resp, null, 2));
            })
            .catch(err => {
                console.error(err);
                setApiResponse(`Error: ${err}`);
            })
    }, []);
    
    if (!apiResponse) {
        return <i>Loading...</i>;
    }
    
    return <pre>{apiResponse}</pre>;
    
}

render(<ApiHello/>, base);
