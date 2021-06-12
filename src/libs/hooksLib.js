import { useEffect, useState } from "react";

export function useFormFields(initialState) {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    function (event) {
      setValues({
        ...fields,
        [event.target.id]: event.target.value,
      });
    },
  ];
}

export function useInfiniteScroll(callback) {
  const [canFetch, setCanFetch] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);

  useEffect(() => {
    let isThrottled = false;
    const delay = 500;

    const handleScroll = () => {
      if (!isThrottled) {
        if (
          window.innerHeight + document.documentElement.scrollTop <
          document.documentElement.offsetHeight - 10
        ) {
          return;
        }

        setCanFetch(true);
        isThrottled = true;

        setTimeout(() => {
          isThrottled = false;
        }, delay);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!canFetch) {
      return;
    }
    setCanFetch(false);
    callback();
  }, [canFetch, callback]);

  return [setCanFetch, pageIndex, setPageIndex];
}
