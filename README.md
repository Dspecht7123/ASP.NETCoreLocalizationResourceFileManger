# Resx Manager

With the Resx Manager you can maintain several .resx-Files at once. It helps you to keep track of different translations by showing all of them in one view.

**Feel free to open a issue if you encounter problems or miss any features.**

<img src="https://raw.githubusercontent.com/Dspecht7123/ASP.NETCoreLocalizationResourceFileManger/main/ResxHelperScreenshot.png" alt="Resx Manager" width="60%"/>


## Features

### manage several resx files in one view
To open the extension press `Strg+Shift+P` and enter `Resource Manager`.

The extension searches for all files with the ending `.resx` in your repository and combines them into one data structure. 
For example, the files `Create.de.resx` and `Create.en.resx` would be combined. You would see it in the "Available Paths" select under the path `pathToYourRepository/Create`.

To be able to find the correct language-codes, only standard language-codes which consist of two characters for the language and two characters for the culture separated by a minus ("de-de" or "en-uk") are taken into account.
If you want to use special language codes please add them in the user or workspace settings.

When you select a path, a table with all the keys and corresponding translations is shown. When the Save-Button is pressed, the current data is saved to the corresponding .resx-files.

If you want to add a new key, enter the key-value in the input-field under the table and press the Add-Button. The new key will be added at the top of the table.

If you want to search for keys, just type the key you are searching for in the "Key Search" field.

### add a single translation
To add a single translation you can press `Strg+Shift+P` and enter `Resource Manager: Add Translation`.

You then need to enter the key of the translation. The value will be filled out automatically if you have marked a text before pressing executing the `Resource Manager: Add Translation` command. The translation will be added to the default resx file (without any language code in the file name).



