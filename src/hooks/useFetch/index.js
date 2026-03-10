import fetch from "@system.fetch";

const useFetch = () => {
  return new Promise((resolve, reject) => {
    fetch.fetch({
      uri: "",
      responseType: "text",
      success: (response) => {
        const { code, data } = response;
        if (code !== 200) {
          reject({
            code,
            data: undefined,
          });
        } else {
          resolve({
            data,
          });
        }
      },
      fail: (data, code) => {
        reject({
          data,
          code,
        });
      },
    });
  });
};

export default useFetch;
