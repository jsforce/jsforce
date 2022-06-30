/**
 *
 */
import { Transform } from 'stream';
import { HttpRequest } from '../types';

let _index = 0;

async function processJsonpRequest(
  params: HttpRequest,
  jsonpParam: string,
  timeout: number,
) {
  if (params.method.toUpperCase() !== 'GET') {
    throw new Error('JSONP only supports GET request.');
  }
  _index += 1;
  const cbFuncName = `_jsforce_jsonpCallback_${_index}`;
  const callbacks: any = window;
  let url = params.url;
  url += url.indexOf('?') > 0 ? '&' : '?';
  url += `${jsonpParam}=${cbFuncName}`;
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  if (document.documentElement) {
    document.documentElement.appendChild(script);
  }
  let pid;
  try {
    const res = await new Promise((resolve, reject) => {
      pid = setTimeout(() => {
        reject(new Error('JSONP call time out.'));
      }, timeout);
      callbacks[cbFuncName] = resolve;
    });
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(res),
    };
  } finally {
    clearTimeout(pid);
    if (document.documentElement) {
      document.documentElement.removeChild(script);
    }
    delete callbacks[cbFuncName];
  }
}

function createRequest(
  jsonpParam: string = 'callback',
  timeout: number = 10000,
) {
  return (params: HttpRequest) => {
    const stream = new Transform({
      transform(chunk, encoding, callback) {
        callback();
      },
      flush() {
        (async () => {
          const response = await processJsonpRequest(
            params,
            jsonpParam,
            timeout,
          );
          stream.emit('response', response);
          stream.emit('complete', response);
          stream.push(response.body);
          stream.push(null);
        })();
      },
    });
    stream.end();
    return stream;
  };
}

export default {
  supported: typeof window !== 'undefined' && typeof document !== 'undefined',
  createRequest,
};
