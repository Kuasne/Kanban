!macro customHeader
  SetBrandingText "Junkie - by Lorenzo"
!macroend

!macro customInit
  MessageBox MB_ICONINFORMATION|MB_OK "Obrigado por instalar o Junkie! Visite nosso site em https://seusite.com"
!macroend

!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "build\background.bmp"

LicensePage "license.txt"
Page directory
Page instfiles

InstallDir $PROGRAMFILES\Junkie
InstallDirRegKey HKCU "Software\Junkie" "Install_Dir"

CreateShortCut $DESKTOP\Junkie.lnk $INSTDIR\junkie.exe
CreateShortCut $STARTMENU\Programs\Junkie\Junkie.lnk $INSTDIR\junkie.exe

Function .onInit
  # Verificar a versão do Windows
  StrCmp $R0 "Win64" 0 +2
  MessageBox MB_ICONSTOP "Este instalador requer uma versão de 64 bits do Windows."
  Abort
FunctionEnd

Function .onInstSuccess
  MessageBox MB_ICONINFORMATION|MB_OK "Instalação concluída com sucesso!"
FunctionEnd

Function .onUninstSuccess
  Delete $INSTDIR\temp_installer_files
FunctionEnd
