
function getAuth() {
    return JSON.parse(localStorage.auth|| "{}");
  }

export default getAuth;