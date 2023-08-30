class GravaFW {

    /**
     * Realiza gravacao nos microcontroladores ST atraves do PVI, via STVP command line 
     * @param {string} dirFirm formato esperado: "I:\\\\Documentos\\\Softwares\\\STM8\\\STM8S003F3\\\INV-173\\\173v01\\\173v01_1.50_Com.stp"
     * @param {string} dirOpt formato esperado: "I:\\\Documentos\\\Softwares\\\STM8\\\STM8S003F3\\\INV-173\\\173v01\\\173v01_1.50_Com.stp"
     * @param {string} modelo_uC formato esperado: "STM8S003F3"
     */
    static async STM8(dirFirm = null, dirOpt = null, objArguments = {}, timeOut = 5000) {

        return new Promise(async (resolve) => {

            let ObjWriteSTM8 = await defineWriteSTM8(dirFirm, dirOpt, objArguments)

            let logGravacao = ""

            if (ObjWriteSTM8.sucess) {

                const id = PVI.FWLink.globalDaqMessagesObservers.add((msg, param) => {

                    console.log(`%cLog Program: ${param[0]}`, ' color: #B0E0E6')
                    logGravacao = logGravacao + param[0]

                    if (param[0] != undefined) {

                        if (param[0].includes(`Verify OPTION BYTE succeeds`)) {

                            PVI.FWLink.globalDaqMessagesObservers.remove(id)
                            clearTimeout(timeOutGravacao)

                            resolve({ sucess: true, msg: logGravacao })

                        } else if (param[0].includes(`ERROR : Cannot communicate with the tool`)) {

                            PVI.FWLink.globalDaqMessagesObservers.remove(id)
                            clearTimeout(timeOutGravacao)

                            resolve({ sucess: null, msg: `Gravador não respondeu` })

                        } else if (param[0].includes(`(API) ERROR`)) {

                            PVI.FWLink.globalDaqMessagesObservers.remove(id)
                            clearTimeout(timeOutGravacao)

                            resolve({ sucess: null, msg: `Não foi possível realizara a gravação` })

                        }

                    }

                }, "sniffer.exec")

                let timeOutGravacao = setTimeout(() => {

                    console.log(`%cLog Program:\n\n${logGravacao}`, ' color: #EE0033')
                    PVI.FWLink.globalDaqMessagesObservers.remove(id)

                    resolve({ sucess: false, msg: `Falha na gravação do firmware final` })

                }, timeOut)

            } else {
                console.log(`%cNenhum diretório de firmware ou option byte informado`, ' color: #EE0033')
                resolve({ sucess: false, msg: `Nenhum diretório de firmware ou option byte informado` })
            }

            pvi.runInstructionS("EXEC", [`C:/Program Files (x86)/STMicroelectronics/st_toolset/stvp/STVP_CmdLine.exe`, ObjWriteSTM8.commandLineArguments, "true", "true"])

        })

        /**
         * 
         * @param {string} dirFirm 
         * @param {string} dirOpt 
         * @param {object} objArguments 
         * @returns 
         */
        async function defineWriteSTM8(dirFirm, dirOpt, objArguments) {

            return new Promise(async (resolve) => {

                const log = objArguments.log == true ? "-log " : ""
                const loop = objArguments.loop == true ? "-loop " : "-no_loop "
                const erase = objArguments.erase == true ? "-erase " : ""
                const blank = objArguments.blank == true ? "-blank " : ""
                const verif = objArguments.verif == true ? "-verif " : ""
                const verbose = objArguments.verbose == true ? "-verbose " : ""
                const version = objArguments.version == true ? "-version " : ""
                const progress = objArguments.progress == true ? "-progress " : ""
                const readProg = objArguments.readProg == true ? "-readProg " : ""
                const readData = objArguments.readData == true ? "-readData " : ""
                const readOption = objArguments.readOption == true ? "-readOption " : ""
                const no_progProg = objArguments.no_progProg == true ? "-no_progProg " : ""
                const warn_protect = objArguments.warn_protect == true ? "-warn_protect " : "-no_warn_protect "
                const no_progOption = objArguments.no_progOption == true ? "-no_progOption " : ""

                const Port = objArguments.Port != undefined ? `-Port=${objArguments.Port} ` : "-Port=USB "
                const ProgMode = objArguments.ProgMode != undefined ? `-ProgMode=${objArguments.ProgMode} ` : "-ProgMode=SWIM "
                const Device = objArguments.Device != undefined ? `-Device=${objArguments.Device}` : ""
                const NbTools = objArguments.NbTools != undefined ? `-NbTools=${objArguments.NbTools} ` : "-NbTools=1 "
                const Tool_ID = objArguments.Tool_ID != undefined ? `-Tool_ID=${objArguments.Tool_ID} ` : "-Tool_ID=0 "
                const BoardName = objArguments.BoardName != undefined ? `-BoardName=${objArguments.BoardName} ` : "-BoardName=ST-LINK ";

                const FileData = objArguments.FileData != undefined ? `-FileOption=${objArguments.FileData} ` : ""
                const FileProg = dirFirm != null ? `-FileProg=${dirFirm.replace(/[\\]/g, `\/`).replace(/\.stp|\.STP/, `.HEX`)} ` : ""
                const FileOption = dirOpt != null ? `-FileOption=${dirOpt.replace(/[\\]/g, `\/`).replace(/\.stp|\.STP/, `.HEX`)} ` : ""

                resolve({
                    sucess: true,
                    commandLineArguments: `${BoardName}${Tool_ID}${NbTools}${Port}${ProgMode}${verbose}` +
                        `${loop}${warn_protect}${erase}${blank}${verif}${FileProg}${FileOption}${FileData}` +
                        `${readProg}${readData}${readOption}${log}${progress}${no_progOption}${no_progProg}${version}${version}${Device}`,
                })

            })
        }
    }

    /**
     * Realiza gravacao nos microcontroladores renesas atraves do PVI, via renesas flash programmer command line
     * @param {string} dirProject Formato esperado: "I:\\\Documentos\\\Softwares\\\RENESAS\\\R5F51303ADFL\\\INV-301\\\301v06\\\301v06.rpj"
     * @param {number} timeOut 
     */
    static async Renesas(dirProject = null, timeOut = 5000) {

        return new Promise((resolve) => {

            if (dirProject != null) {

                let logGravacao = ""

                const id = PVI.FWLink.globalDaqMessagesObservers.add((msg, param) => {

                    console.log(`%cLog Program: ${param[0]}`, ' color: #B0E0E6')
                    logGravacao = logGravacao + param[0]

                    if (param[0] != undefined) {

                        if (param[0].includes(`Operation completed.`)) {

                            PVI.FWLink.globalDaqMessagesObservers.remove(id)
                            clearTimeout(timeOutGravacao)

                            resolve({ sucess: true, msg: logGravacao })

                        } else if (param[0].includes(`Cannot find the specified tool.`)) {

                            PVI.FWLink.globalDaqMessagesObservers.remove(id)
                            clearTimeout(timeOutGravacao)

                            resolve({ sucess: null, msg: `Gravador não respondeu` })

                        } else if (param[0].includes(`Error: No project file specifed.`)) {

                            PVI.FWLink.globalDaqMessagesObservers.remove(id)
                            clearTimeout(timeOutGravacao)

                            resolve({ sucess: false, msg: `Projeto informado é inválido` })

                        }

                    }

                }, "sniffer.exec")

                pvi.runInstructionS("EXEC", [`${pvi.runInstructionS("GETPVIPATH", [])}/Resources/Renesas/RFPV3.Console.exe`, dirProject, "true", "true"])

                let timeOutGravacao = setTimeout(() => {

                    PVI.FWLink.globalDaqMessagesObservers.remove(id)
                    resolve({ sucess: false, msg: `Tempo de gravação excedido` })

                }, timeOut)

            } else {
                resolve({ sucess: false, msg: `Caminho do firmware não informado` })
            }

        })
    }

    /**
     * Realiza gravacao nos microcontroladores Nuvoton atraves do PVI, via JLink command line
     * @param {string} dirProject Formato esperado: "C:\\Users\\eduardo.rezzadori\\Desktop\\Farmwar\\193M3PL3v01_3.02.hex"
     * @param {string} commandFile Arquivo de comandos JLink, pseudo-script de gravação
     * @param {string} device modelo do micrcontrolador
     * @param {number} timeOut 
     */
    static async JLink_v7(dirProject = null, commandFile = null, device, timeOut = 10000) {

        let logGravacao = ""

        const id = PVI.FWLink.globalDaqMessagesObservers.add((msg, param) => {

            console.log(`%cLog Program: ${param[0]}`, ' color: #B0E0E6')
            logGravacao = logGravacao + param[0]

            if (data == "Script processing completed.") {

                PVI.FWLink.globalDaqMessagesObservers.remove(id)

                if (logGravacao.includes(`O.K.`)) {

                    clearTimeout(timeOutGravacao)
                    resolve({ sucess: true, msg: `Gravado com sucesso, caminho: ${dirProject}` })

                } else if (logGravacao.includes(`Cannot connect to target.`)) {

                    clearTimeout(timeOutGravacao)
                    resolve({ sucess: false, msg: `Cannot connect to target.` })

                }

            }
        }, "sniffer.exec")

        pvi.runInstructionS("EXEC", [`${pvi.runInstructionS("GETPVIPATH", [])}\\Plugins\\JLINK7\\JLink.exe`, `-device ${device} -CommandFile ${commandFile}`, "true", "true"])

        let timeOutGravacao = setTimeout(() => {

            PVI.FWLink.globalDaqMessagesObservers.remove(id)
            resolve({ sucess: false, msg: `Falha na gravação, verifique a conexão USB do gravador.` })

        }, timeOut)

    }


    /**
     * Realiza gravacao nos microcontroladores Nuvoton atraves do PVI, via JLink command line
     * @param {string} sessionStorageTag nome que sera utilizado para armazenar a porta COM encontrada
     * @param {string} appPath formato esperado: "I:\\Documentos\\Softwares\\ESP32\\INV-161\\31L\\INV-161_INV-161_HW2-31-FW-v1.bat" ou "I:\\Documentos\\Softwares\\ESP32\\INV-161\\31L\\INV-161_INV-161_HW2-31-FW-v1.bin"
     * @param {boolean} isBatFile true = firmware esta em .bat / false = firmware esta em .bin
     * @param {number} betweenMsgTimeout timeout maximo para inatividade na comunicação com o ESP32 
     */
    static async ESP32(sessionStorageTag, appPath, isBatFile, betweenMsgTimeout) {

        return new Promise((resolve) => {

            console.time("WriteFirmware")

            if (!appPath) {
                resolve({ sucess: false, msg: "Caminho de arquivo para gravação não especificado" }); return
            }

            let portsFound = null, tryingPorts = [], lastTimeMsg = new Date().getTime()

            const betweenMsgMonitor = setInterval(() => {

                if (new Date().getTime() - lastTimeMsg > betweenMsgTimeout) {
                    clearInterval(betweenMsgMonitor)
                    PVI.FWLink.globalDaqMessagesObservers.remove(id)
                    resolve({ sucess: false, msg: "esptool.py encontrou um problema e teve que ser finalizado." }); return
                }

            }, 1000)

            const id = PVI.FWLink.globalDaqMessagesObservers.add((filter, message) => {

                const info = message[0]
                lastTimeMsg = new Date().getTime()
                console.log(`%cLog Program: ${message}`, ' color: #87CEEB')

                if (info.includes("Found")) {
                    const splittedInfo = info.split(" ")
                    portsFound = parseInt(splittedInfo[1])

                } else if (info.includes("Serial port")) {
                    const splittedInfo = info.split(" ")
                    tryingPorts.push(splittedInfo[2])
                    UI.setMsg(`Tentando gravar na porta ${splittedInfo[2]}`)

                } else if (info.includes("failed to connect")) {
                    if (tryingPorts.length >= portsFound) {
                        PVI.FWLink.globalDaqMessagesObservers.remove(id)
                        resolve({ sucess: false, msg: "Gravador não conseguiu se conectar com o ESP32" }); return
                    }

                } else if (info.includes("%")) {
                    UI.setMsg(info)

                } else if (info.includes("Hard resetting via RTS pin...")) {
                    sessionStorage.getItem(sessionStorageTag) == null ? sessionStorage.setItem(sessionStorageTag, tryingPorts.pop()) : null
                    PVI.FWLink.globalDaqMessagesObservers.remove(id)
                    resolve({ sucess: true, msg: "Gravação bem sucedida" })
                    console.timeEnd("WriteFirmware")
                }

            }, "PVI.Sniffer.sniffer.exec_return.data")

            console.log("writeFirmware ID", id)

            let pythonPath = "C:/esp-idf/Python/python.exe"
            let espToolPath = "C:/esp-idf/components/esptool_py/esptool/esptool.py"
            let port = ""

            sessionStorage.getItem(sessionStorageTag) != null ? port = `-p${sessionStorage.getItem(sessionStorageTag)}` : null

            const args = `${espToolPath} ${port} -b 480600 --before default_reset --after hard_reset --chip esp32  write_flash --flash_mode dio --flash_size detect --flash_freq 40m 0x0000 ${appPath}`

            if (isBatFile) {
                console.log(`Executando batch: ${appPath} args: ${port}`)
                pvi.runInstructionS("EXEC", [appPath, port, "true", "true", "true"])
            } else {
                console.log(`Executando python: ${pythonPath} args: ${args}`)
                pvi.runInstructionS("EXEC", [pythonPath, args, "true", "true", "true"])
            }

        })
    }

}