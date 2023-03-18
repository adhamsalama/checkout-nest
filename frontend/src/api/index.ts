import { useEffect, useState } from "react";

export enum HTTPMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export function io(
  url: string,
  method: HTTPMethod,
  body?: object | null,
  headers?: { [key: string]: string }
) {
  const [data, setdata] = useState<unknown>(null);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState<null | object | Error>(null);
  useEffect(() => {
    fetch(url, {
      method: method.toString(),
      headers,
      ...(body && { body: JSON.stringify(body) }),
    })
      .then((res) => res.json())
      .then((data) => {
        seterror(null);
        setdata(data);
      })
      .catch((err) => {
        seterror(err);
        setdata(null);
      })
      .finally(() => {
        setloading(false);
      });
  }, [url]);
  return { data, loading, error };
}

// export default useFetch;
// export default io;
