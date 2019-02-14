var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true,
  theme: "abcdef",
  readOnly: "true",
  cursorBlinkRate: -1
});

const language = document.getElementById("snippet-language").innerHTML


switch (language) {
  case "HTML":
    console.log("html")
    editor.setOption("mode", "xml")
    break
  case "CSS":
    editor.setOption("mode", "css")
    break
  case "JS":
    editor.setOption("mode", "javascript")
    break
}
