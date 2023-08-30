# Gravação de Firmware PVI

Biblioteca que auxilia na gravação de microcontroladores por linha de comando através do PVI.

## Instalando

Abra o terminal, e na pasta do script, execute:

```
npm i @libs-scripts-mep/grav-fw-pvi
```

## Desinstalando

Abra o terminal, e na pasta do script, execute:

```
npm uninstall @libs-scripts-mep/grav-fw-pvi
```

<br>

| Fabricante | Ferramenta               | Suporte |
| ---------- | ------------------------ | ------- |
| ST         | STVP                     | ✔️       |
| Renesas    | Renesas Flash Programmer | ✔️       |
| Nuvoton    | JLink v7.82              | ✔️       |

## Exemplo de Utilização do Modulo

### STM8
```js

static async GravaFirmware(dirFirm, dirOpt) {

        const ObjParams = {

            objArguments: {
                verbose: true,
                Device: "STM8S003F3",
            },
            timeOut : 4000

        }

        return new Promise(async (resolve) => {

            let RetornoGravacao = await GravaFW.STM8(dirFirm, dirOpt, ObjParams.objArguments, ObjParams.timeOut)

            if (RetornoGravacao.sucess) {

                console.log("GRAVOU")
                
            } else {

                console.log("NÃO GRAVOU")
            }

        })

}  

```

#### <h3> Possíveis valores para os argumentos da gravação <h3>


```js
[-BoardName=STxxx] ==========> Programming Tool name (ST-LINK, RLINK, STICE, ...)
[-Tool_ID=x] ================> ST-LINK Programming Tool ID (0, 1, 2...)
[-NbTools=x] ================> Number of ST-LINK Tools with same device connected (Tool_ID is automatically incremented)
[-Port=xxx] =================> Communication Port (USB, LPT1)
[-ProgMode=xxx] =============> Programming mode or protocol (SWIM, JTAG, SWD)
[-Device=STxxx] =============> Device name (exact same name as in STVP)
[-version] ==================> Display version of this application
[-verbose] ==================> Display messages, warnings, errors
[-log] ======================> Generate or append Result.log log file
[-loop] =====================> Loop on actions until 'Space' key hit
[-progress] =================> Display progress of each action
[-warn_protect] =============> Message Box if programming Option Byte protection
[-no_progProg] ==============> Do not program PROGRAM MEMORY (used to verify device from a file)
[-no_progData] ==============> Do not program DATA MEMORY (used to verify device from a file)
[-no_progOption] ============> Do not program OPTION BYTE (used to verify device from a file)
[-readProg] =================> Read PROGRAM MEMORY
[-readData] =================> Read DATA MEMORY
[-readOption] ===============> Read OPTION BYTE
[-erase] ====================> Erase the device (before programming)
[-blank] ====================> Blank Check the device (before programming)
[-verif] ====================> Verify the device after programming
[-FileProg=fname.hex/s19] ===> File name to program PROGRAM MEMORY area (hex or s19)
[-FileData=fname.hex/s19] ===> File name to program DATA MEMORY area (hex or s19)
[-FileOption=fname.hex/s19] => File name to program OPTION BYTE area (hex or s19)



objArguments = {

    log: true or false 
    loop: true or false
    erase: true or false
    blank: true or false
    verif: true or false
    verbose: true or false
    version: true or false
    progress: true or false
    readProg: true or false
    readData: true or false
    readOption: true or false
    no_progProg: true or false
    warn_protect: true or false
    no_progOption: true or false
    verbose: true or false,

    Port:"USB",
    ProgMode:"SWIM",
    NbTools:"1",
    Tool_ID:"0",
    BoardName:"ST-LINK",
    Device: "STM8S003F3",
    FileData: ""

},  


```
