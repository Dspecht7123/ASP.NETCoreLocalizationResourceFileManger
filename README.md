# ASP.NET Core Localization Resource File Manger

With the ASP.NET Core Localization Resource File Manager you can maintaine several .resx-Files at once. It helps you to keep track of different translations by showing all of them in one view. 

<img src="https://raw.githubusercontent.com/Dspecht7123/ASP.NETCoreLocalizationResourceFileManger/main/ResxHelperScreenshot.png" alt="Resource Manager" width="60%"/>


## Features

To open the extension press `Strg+Shift+P` and enter `Resource Manager`.

The extension searches for all files with the ending `.resx` in your repository and combines them into one data structure. 
For example, the files `Create.de.resx` and `Create.en.resx` would be combined. You would see it in the "Available Paths" select under the path `pathToYourRepository/Create`.

To be able to find the correct language-codes, only standard language-codes which consist of two characters for the language and two characters for the culture separated by a minus ("de-de" or "en-uk") are taken into account.
If you want to use special language codes please add them in the user or workspace settings.

When you select a path, a table with all the keys and corresponding translations is shown. When the Save-Button is pressed, the current data is saved to the corresponding .resx-files.

If you want to add a new key, enter the key-value in the input-field under the table and press the Add-Button. The new key will be added at the top of the table.

If you want to search for keys, just type the key you are searching for in the "Key Search" field.



