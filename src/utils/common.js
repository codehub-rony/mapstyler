const download_stylejson = function (stylejson) {
  const a = document.createElement("a");
  const json = JSON.stringify(stylejson, null, 2);
  const file = new Blob([json], { type: "application/json" });
  a.href = URL.createObjectURL(file);
  a.download = `${stylejson.name}.json`;
  a.click();
};

export default {
  download_stylejson,
};
