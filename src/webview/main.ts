// file: src/webview/main.ts

import { provideVSCodeDesignSystem, vsCodeButton, Button, vsCodeDropdown, Dropdown, vsCodeOption, Option, vsCodeTextField, TextField } from "@vscode/webview-ui-toolkit";
import { ISpecificTranslation, ITranslation } from "../types";

provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeDropdown(), vsCodeOption(), vsCodeTextField());

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
        return;
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
    new_tr.appendChild(new_th);
    new_thead.appendChild(new_tr);
    new_th = document.createElement('th');
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
    let option = new Option("please select a path...", "");
    select.appendChild(option);
    for (let translationFile of message.message) {
      console.log(translationFile.path.fsPath + "/" + translationFile.name);
      let text = translationFile.path.fsPath + "/" + translationFile.name;
      let value = translationFile.path.fsPath + "/" + translationFile.name;
      let option: Option;
      if (firstOption) {
        option = new Option(text, value, true);
      } else {
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
        let newCell = row.insertCell(0);
        let button = createRemoveButtonElement(translation);
        newCell.appendChild(button);
        let input = createKeyInputElement(translation);
        input.value = translation.key;
        newCell = row.insertCell(1);
        newCell.appendChild(input);
        let columnCounter = 2;
        for (let i = 0; i < numberOfLanguages; i++) {
          let indexOfSpecificTranslation = translation.specificTranslations.map(function (e: { language: any; }) { return e.language; }).indexOf((languageCodes[i]));
          let specificTranslation = translation.specificTranslations[indexOfSpecificTranslation];
          if (specificTranslation === undefined) {
            row.insertCell(columnCounter).innerHTML = languageCodes[i];
            let newLength = translation.specificTranslations.push({
              "language": languageCodes[i],
              "value": ""
            }
            );
            let input = createInputElement(translation.specificTranslations[newLength - 1]);
            translation.specificTranslations[newLength - 1].createdByResourceManager = true;
            row.insertCell(columnCounter + 1).appendChild(input);
          } else {
            row.insertCell(columnCounter).innerHTML = specificTranslation.language;
            let input = createInputElement(specificTranslation);
            specificTranslation.createdByResourceManager = false;
            if (typeof specificTranslation.value === 'string' || specificTranslation.value instanceof String){
              input.value = specificTranslation.value;
            }else{
              input.value = specificTranslation.value.value[0];
            }
            row.insertCell(columnCounter + 1).appendChild(input);

          }
          columnCounter++;
          columnCounter++;
        }
      }
    }
  }

  function createKeyInputElement(specificTranslation: any) {
    let input = document.createElement('input');
    input.addEventListener('input', function (e: any) {
      specificTranslation.key = e.target.value;
    }.bind(specificTranslation), true);
    return input;
  }

  function createInputElement(specificTranslation: any) {
    let input = document.createElement('input');
    input.style.borderColor = getInputColor(specificTranslation.value);

    input.addEventListener('input', function (e: any) {
      specificTranslation.value = e.target.value;

      input.style.borderColor = getInputColor(e.target.value);
    }.bind(specificTranslation), true);
    return input;
  }
  function getInputColor(value: string){
    let result = value === "" ? "red" : "";
    return result;
  }

  function createRemoveButtonElement(boundTranslation: any) {
    let button = document.createElement('vscode-button') as Button;
    button.innerText = 'X';
    //button.appearance = 'icon'; 
    //let span = document.createElement('span');
    //span.className = "codicon codicon-close";
    //button.appendChild(span);
    button.addEventListener('click', function (e: any) {
      let translationFileIndex = getTranslationFileIndex(receivedData);
      if (translationFileIndex !== undefined) {
        let translations = receivedData.message[translationFileIndex].translations
        for (let i = 0; i < translations.length; i++) {
          if (translations[i].key === boundTranslation.key) {
            translations.splice(i, 1);
            break;
          }
        }
        buildTranslationsTable(receivedData);
      }
    }.bind(boundTranslation), true);
    return button;
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
    }
  }

  const addKeyButton = document.getElementById("addKeyButton");
  if (addKeyButton !== null) {
    addKeyButton.addEventListener("click", () => { addKey() });
  }
  const searchBox = document.getElementById("searchBox");
  if (searchBox !== null) {
    searchBox.addEventListener("input", (e: Event) => { searchKeys(e.currentTarget as HTMLInputElement) });
  }

  function addKey() {
    let keyInputField = document.getElementById("keyInputField") as HTMLInputElement;
    let searchBox = document.getElementById("searchBox") as HTMLInputElement;
    if (keyInputField !== null) {
      let newKey = keyInputField.value;
      if (newKey === "") {
        vscode.postMessage({
          command: 'message',
          text: 'please enter a key'
        })
      } else {
        addTableRow(newKey);
        keyInputField.value = "";
        searchBox.value = "";
      }
    }
  }
  function searchKeys(e: HTMLInputElement) {
    let rows = table.getElementsByTagName("tbody")[0].querySelectorAll("tr");
    if (e.value.length === 0) {
      rows.forEach(e=>{
        e.hidden = false;
      });
      return;
    }
    for (let index = 0; index < rows.length; index++) {
      const currentRow = rows[index];
      let hideElement = false;
      if (!currentRow.querySelectorAll("input")[0].value.toUpperCase().includes(e.value.toUpperCase().trim())) {
        hideElement = true;
      }
      currentRow.hidden = hideElement;
    }
  }

  function addTableRow(key: string) {
    let index = getTranslationFileIndex(receivedData)
    if (index !== undefined) {
      let translation = receivedData.message[index].translations[0];
      let translationCopy: ITranslation = {
        added: false,
        key: key,
        specificTranslations: []
      };
      /*for (let specificTranslation of translation.specificTranslations) {
        let specificTranslationCopy: ISpecificTranslation = {
          "language": specificTranslation.language,
          "value": ""
        };
        translationCopy.specificTranslations.push(specificTranslationCopy);
      }*/
      receivedData.message[index].translations.push(translationCopy);
      buildTranslationsTable(receivedData);
    }
  }
}