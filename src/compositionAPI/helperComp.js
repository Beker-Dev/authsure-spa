export default function helperComp() {
  function formatDateTime(value) {
    console.log(value)
    return value ? 'Hello' : null;
  }

  return {
    formatDateTime,
  };
}
