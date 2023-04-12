// file: src/webview/main.ts

import { provideVSCodeDesignSystem, vsCodeButton, vsCodeDropdown, Dropdown, vsCodeOption, Option } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeDropdown(), vsCodeOption());

window.addEventListener("load", main);

function main() {
  // To get improved type annotations/IntelliSense the associated class for
  // a given toolkit component can be imported and used to type cast a reference
  // to the element (i.e. the `as Button` syntax)
  // const howdyButton = document.getElementById("howdy") as Button;
  // howdyButton?.addEventListener("click", handleHowdyClick);
  const vscode = acquireVsCodeApi();
  const table = document.getElementById("table") as HTMLTableElement;
  let numberOfLanguages = 0;
  vscode.postMessage({
    command: 'opened'
  })

  const select = document.getElementById("paths") as Dropdown;
  select.addEventListener("change", function () {
    buildTranslationsTable(receivedData);
  })

  // Handle the message inside the webview
  let receivedData: any = {};
  window.addEventListener('message', event => {
    const message = event.data; // The JSON data our extension sent
    switch (message.command) {
      case 'receivedata':
        receivedData = message;
        addPathsToSelect(message);
        buildTranslationsTable(message);
    }
  });

  function buildTranslationsTable(message: any) {
    resetTable();
    addTableHeads(message);
    addRowsToTable(message);
  }

  function resetTable() {
    let tbody = table.getElementsByTagName('tbody')[0];
    let new_body = document.createElement('tbody');
    if (tbody.parentNode !== null) {
      tbody.parentNode.replaceChild(new_body, tbody);
    }
    let thead = table.getElementsByTagName('thead')[0];
    let new_thead = document.createElement('thead');
    let new_tr = document.createElement('tr');
    let new_th = document.createElement('th');
    new_th.innerHTML = 'Key';
    new_tr.appendChild(new_th);
    new_thead.appendChild(new_tr);
    if (thead.parentNode !== null) {
      thead.parentNode.replaceChild(new_thead, thead);
    }
  }

  function addPathsToSelect(message: any) {
    removeSelectOptions(select);
    let firstOption = true;
    let option = new Option("please select a path...","");
    select.appendChild(option);
    for (let translationFile of message.message) {
      console.log(translationFile.path.fsPath + "/" + translationFile.name);
      let text = translationFile.path.fsPath + "/" + translationFile.name;
      let value = translationFile.path.fsPath + "/" + translationFile.name;
      let option: Option;
      if(firstOption){
        option = new Option(text, value, true);
      }else{
        option = new Option(text, value);
      }
      select.appendChild(option);
      firstOption = false;
    }
    select.selectFirstOption();
  }

  function removeSelectOptions(select: any) {
    let options = select.children;
    for (var i = options.length; i--;) {
      select.removeChild(options[i]);
    }
  }

  function addTableHeads(message: any) {
    let translationFileIndex = getTranslationFileIndex(message);
    if (translationFileIndex !== undefined) {
      let languageCodes = message.message[translationFileIndex].languageCodes;
      numberOfLanguages = languageCodes.length;
      for (let index in languageCodes) {
        let language = languageCodes[index];
        let thead = table.getElementsByTagName('thead')[0].children[0];
        let th = document.createElement('th');
        th.innerHTML = language;
        thead.append(th);
        let emptyThElement = document.createElement('th');
        emptyThElement.innerHTML = 'Value';
        thead.append(emptyThElement);
      }
    }

  }

  function addRowsToTable(message: any) {
    let translationFileIndex = getTranslationFileIndex(message);
    if (translationFileIndex !== undefined) {
      let languageCodes = message.message[translationFileIndex].languageCodes;
      for (let index in message.message[translationFileIndex].translations) {
        let translation = message.message[translationFileIndex].translations[index];
        let tbody = table.getElementsByTagName('tbody')[0];
        let row = tbody.insertRow(0);
        let input = createKeyInputElement(translation);
        input.value = translation.key;
        row.insertCell(0).appendChild(input);
        let columnCounter = 1;
        for (let i = 0; i < numberOfLanguages; i++) {
          let specificTranslation = translation.specificTranslations[i];
          if (specificTranslation === undefined) {
            row.insertCell(columnCounter).innerHTML = languageCodes[i];
            translation.specificTranslations.push({
              "language": languageCodes[i],
              "value": ""
            }
            );
            let input = createInputElement(translation.specificTranslations[i]);
            row.insertCell(columnCounter + 1).appendChild(input);
          } else {
            row.insertCell(columnCounter).innerHTML = specificTranslation.language;
            let input = createInputElement(specificTranslation);
            input.value = specificTranslation.value;
            row.insertCell(columnCounter + 1).appendChild(input);

          }
          columnCounter++;
          columnCounter++;
        }
      }
    }
  }

  function createKeyInputElement(specificTranslation: any) {
    let input = document.createElement("input");
    input.addEventListener('input', function (e: any) {
      specificTranslation.key = e.target.value;
    }.bind(specificTranslation), true);
    return input;
  }

  function createInputElement(specificTranslation: any) {
    let input = document.createElement("input");
    input.addEventListener('input', function (e: any) {
      specificTranslation.value = e.target.value;
    }.bind(specificTranslation), true);
    return input;
  }

  function getTranslationFileIndex(message: any) {
    var key = select.value;
    for (let index in message.message) {
      let translationFile = message.message[index];
      if ((translationFile.path.fsPath + "/" + translationFile.name) === key) {
        return index;
      }
    }
  }

  const saveButton = document.getElementById("saveButton");
  if (saveButton !== null) {
    saveButton.addEventListener("click", () => { save() });
  }

  function save() {
    let translationFileIndex = getTranslationFileIndex(receivedData);
    if (translationFileIndex !== undefined) {
      let translationFile = receivedData.message[translationFileIndex];
      vscode.postMessage({
        command: 'update',
        json: JSON.stringify(translationFile)
      });
      vscode.postMessage({
        command: "hello",
        text: "Saved",
      });
    }
  }
}