var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true,
  theme: "abcdef",
  mode: "xml"
});



function changeMode(mode) {
  let selectValue = mode.value
  switch (selectValue) {
    case "HTML":
      console.log("html")
      editor.setOption("mode", "xml")
      break
    case "CSS":
      console.log("css")

      editor.setOption("mode", "css")
      break
    case "JS":
      console.log("js")

      editor.setOption("mode", "javascript")
      break
  }
}